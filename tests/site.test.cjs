const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"assets/site.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
// The content and draft builder are pure. Do not simulate or replace browser behavior.
const prelude=["catalog-sources.js","catalog.js","solution-translations.js"].map(file=>fs.readFileSync(path.join(root,"assets",file),"utf8")).join("\n");
const catalog=vm.runInNewContext(prelude+'\n'+source.slice(0,source.indexOf('let language="zh";'))+';({products,translations,buildInquiry,catalogData,catalogSources});');

test("every storefront translation, placeholder and accessible name exists in both languages",()=>{
  const used=[...html.matchAll(/data-(?:i18n|placeholder|label|alt)="([^"]+)"/g)].map(match=>match[1]);
  for(const locale of ["zh","en"]){
    for(const key of used)assert.ok(catalog.translations[locale][key],locale+": "+key);
  }
  assert.deepEqual(Object.keys(catalog.translations.zh).sort(),Object.keys(catalog.translations.en).sort());
});
test("all local storefront assets and research entry point resolve",()=>{
  for(const [,reference] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    if(/^(?:https?:|mailto:|#)/.test(reference))continue;
    assert.ok(fs.existsSync(path.join(root,reference)),reference);
  }
  for(const product of catalog.products.filter(p=>p.image))assert.ok(fs.existsSync(path.join(root,"assets",product.image)));
  assert.ok(fs.readFileSync(path.join(root,"research.html"),"utf8").includes("orbit_radiation.json"));
});
test("each catalog solution has bilingual reference specs and a real source URL",()=>{
  assert.equal(new Set(catalog.products.map(product=>product.id)).size,8);
  for(const product of catalog.products){
    assert.match(product.source,/^https:\/\/github\.com\/juwadeLone\//);
    for(const locale of ["zh","en"]){
      assert.ok(product[locale].title);
      assert.ok(product[locale].description);
      assert.ok(product[locale].detail);
      assert.ok(product[locale].specs.length>=3);
    }
  }
});
test("SAR gallery reproduces pinned synthetic-point figures with matching dimensions and digests",()=>{
  const crypto=require("node:crypto");
  const provenance=JSON.parse(fs.readFileSync(path.join(root,"assets/sar/provenance.json"),"utf8"));
  assert.equal(provenance.figures.length,3);
  for(const figure of provenance.figures){
    assert.equal(figure.dataset,"Synthetic point targets");
    assert.match(figure.commit,/^[a-f0-9]{40}$/);
    const bytes=fs.readFileSync(path.join(root,"assets/sar",figure.file));
    assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"),figure.sha256);
    assert.equal(bytes.readUInt32BE(16),figure.width);
    assert.equal(bytes.readUInt32BE(20),figure.height);
    assert.ok(html.includes(figure.url));
    assert.ok(html.includes('src="assets/sar/'+figure.file+'"'));
    assert.ok(figure.url.includes("/blob/"+figure.commit+"/"));
  }
});
test("Chinese and English inquiry drafts preserve Unicode and URL-reserved characters",()=>{
  for(const locale of ["zh","en"]){
    const data={name:"朱 & Team",email:"lab+sar@example.org",organization:"研发 #1",requirements:"SAR 2048×2048\nUDP & UART? budget=待定"};
    const draft=catalog.buildInquiry(data,catalog.translations[locale],"SAR / FPGA",catalog.translations[locale].ground);
    const url=new URL(draft.mailto);
    assert.equal(url.protocol,"mailto:");
    assert.equal(url.pathname,"1906233797@qq.com");
    assert.equal(url.searchParams.get("subject"),draft.subject);
    assert.equal(url.searchParams.get("body"),draft.body);
    assert.ok(draft.text.includes(data.requirements));
    assert.ok(draft.text.includes(data.email));
    assert.ok(draft.text.startsWith(catalog.translations[locale].mailTo+": 1906233797@qq.com\n"));
  }
});

test("measured-paper figures preserve citations, source pins and file digests",()=>{
  const crypto=require("node:crypto");
  const folder=path.join(root,"assets/sar/papers");
  const provenance=JSON.parse(fs.readFileSync(path.join(folder,"provenance.json"),"utf8"));
  assert.equal(provenance.scenes.length,3);
  assert.match(provenance.scope,/not this storefront's FPGA board outputs/);
  assert.match(provenance.rights,/no open license/);
  assert.match(provenance.commit,/^[a-f0-9]{40}$/);
  assert.deepEqual(provenance.scenes.map(scene=>scene.figure),[21,19,22]);
  for(const scene of provenance.scenes){
    const bytes=fs.readFileSync(path.join(folder,scene.file));
    assert.equal(bytes.toString("ascii",0,4),"RIFF");
    assert.equal(bytes.toString("ascii",8,12),"WEBP");
    assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"),scene.sha256);
    assert.match(scene.pdf_sha256,/^[a-f0-9]{64}$/);
    assert.match(scene.embedded_sha256,/^[a-f0-9]{64}$/);
    assert.ok(scene.source.includes("/blob/"+provenance.commit+"/"));
    assert.ok(scene.pdf_path.startsWith("文献/SAR成像算法/"));
    assert.ok(scene.authors.includes("Guang-Cai Sun"));
    assert.equal(new URL(scene.doi).host,"doi.org");
    assert.ok(html.includes(scene.doi));
    assert.ok(html.includes('src="assets/sar/papers/'+scene.file+'"'));
  }
  assert.doesNotMatch(html,/assets\/sar\/scenes\/|jpl\.nasa\.gov|NASA\/JPL/);
  for(const locale of ["zh","en"]){
    assert.ok(catalog.translations[locale].sceneKind.includes(locale==="zh"?"非板卡实测":"NOT OUR BOARD OUTPUT"));
    assert.ok(catalog.translations[locale].heroSceneCredit.includes(locale==="zh"?"非本板卡输出":"not our board output"));
  }
});

test("buyer-facing catalog labels disclose source access and compute the total",()=>{
  for(const locale of ["zh","en"]){
    assert.ok(catalog.translations[locale].source.includes(locale==="en"?"repository access required":"仓库访问权限"));
    assert.ok(catalog.translations[locale].filterAll(7).includes("<span>07</span>"));
  }
  const boards=catalog.products.filter(product=>product.category==="board");
  assert.deepEqual(Array.from(boards,p=>p.id),["a7","k7","v7"]);
  for(const product of boards){
    assert.ok(!product.datasheet,"Bare boards must not link algorithm validation as their datasheet");
    for(const locale of ["zh","en"]){
      assert.equal(product[locale].specs.length,6);
      assert.doesNotMatch(JSON.stringify(product[locale].specs),/run_s|pass_gate|SEM|FFT|CSA|BP|2048|4096|125 MHz|4\.29/);
    }
  }
  assert.ok(catalog.translations.en.count(boards.length).startsWith("3 boards"));
});
test("optional organization falls back cleanly and input whitespace is trimmed",()=>{
  const draft=catalog.buildInquiry({name:" A ",email:" a@b.co ",organization:" ",requirements:" test "},catalog.translations.en,"Custom","Ground");
  assert.match(draft.body,/Name: A\nEmail: a@b.co/);
  assert.ok(draft.body.includes("Organization / team: Not provided"));
  assert.ok(draft.body.endsWith("Requirements:\ntest"));
});

test("datasheets preserve campaign denominators and excluded records",()=>{
  const sar=JSON.parse(fs.readFileSync(path.join(root,"datasheets/sar.json"),"utf8"));
  for(const campaign of Object.values(sar.campaigns)){
    for(const arm of Object.values(campaign)){
      assert.equal(arm.records,arm.MASKED+arm.SDC+arm.DUE+arm.NO_TASK);
    }
    assert.equal(Object.values(campaign).reduce((n,arm)=>n+arm.records,0),2051);
  }
  assert.equal(sar.campaigns.sem_campaign_pt3x3w.e0.NO_TASK,1);
  assert.equal(sar.campaigns.sem_campaign_pt3x3w.e2_post.NO_TASK,4);
  const bp=JSON.parse(fs.readFileSync(path.join(root,"datasheets/bp.json"),"utf8"));
  for(const build of Object.values(bp.builds)){
    assert.equal(build.e0.valid,1200);
    assert.equal(build.failure.k,build.e0.below_line+(build.e0.DUE||0));
    assert.equal(build.failure.share,build.failure.k/build.failure.n);
    assert.ok(build.failure.share_ci[0]<=build.failure.share);
    assert.ok(build.failure.share_ci[1]>=build.failure.share);
    assert.equal(build.control.records,build.control.valid+build.control.invalid);
  }
  assert.equal(bp.builds.P7C.e0.records-bp.builds.P7C.e0.valid,1);
});
test("algorithm and FFT validation links have offline sheets with pinned evidence",()=>{
  for(const product of catalog.products.filter(p=>p.datasheet)){
    const sheet=fs.readFileSync(path.join(root,"datasheets",product.datasheet+".html"),"utf8");
    assert.ok(sheet.includes("window.print()"));
    assert.ok(sheet.includes('download="juwade-'+product.datasheet+'-datasheet.html"'));
    const evidence=JSON.parse(fs.readFileSync(path.join(root,"datasheets",product.datasheet+".json"),"utf8"));
    assert.ok(evidence.sources.length>0);
    assert.ok(evidence.source_access.includes("Repository access may be required"));
    assert.ok(sheet.includes("Source repository access required"));
    for(const entry of evidence.sources){
      assert.match(entry.sha256,/^[a-f0-9]{64}$/);
      assert.match(entry.commit,/^[a-f0-9]{40}$/);
      assert.ok(entry.url.includes("/blob/"+entry.commit+"/"));
    }
    if(product.id==="fft")assert.ok(evidence.measurement_status.includes("No published numeric"));
  }
});

test("catalog parameters resolve to pinned sources and memory/timing retain evidence boundaries",()=>{
  const provenance=JSON.parse(fs.readFileSync(path.join(root,"assets/catalog-provenance.json"),"utf8"));
  for(const item of [...catalog.products,...catalog.catalogData.cases]){
    assert.ok(item.sourceIds.length);
    for(const id of item.sourceIds){
      const entry=provenance.sources[id];
      assert.ok(entry,id);
      assert.match(entry.commit,/^[a-f0-9]{40}$/);
      assert.match(entry.sha256,/^[a-f0-9]{64}$/);
      assert.ok(entry.url.includes("/blob/"+entry.commit+"/"));
      assert.equal(catalog.catalogSources[id].sha256,entry.sha256);
    }
  }
  for(const [board,bytes] of [["a7",512*2**20],["k7",2*2**30],["v7",8*2**30]]){
    const memory=provenance.memory[board];
    assert.equal(memory.total_bytes,bytes);
    assert.equal(memory.total_bytes,memory.channel_bytes.reduce((a,b)=>a+b,0));
    assert.match(memory.basis,/configuration geometry/);
  }
  assert.equal(provenance.k7_historical_run.pass_gate,false);
  assert.equal(provenance.k7_historical_run.used_as_benchmark,false);
  assert.equal(provenance.bp_v4.runs.length,2);
  assert.ok(provenance.bp_v4.runs.every(run=>run.ok&&run.pixels_differing===0));
  assert.equal(catalog.catalogData.cases.length,4);
  assert.ok(catalog.catalogData.cases.find(c=>c.id==="k7-bp-v4").en.result.includes("excludes upload/readback"));
  assert.ok(catalog.products.find(p=>p.id==="fft").en.detail.includes("constraint, not measured"));
  assert.ok(catalog.products.find(p=>p.id==="cordic").en.detail.includes("CE-enabled advances"));
});

test("hardware, algorithms, primitives, simulation, imagery and validation have unique destinations",()=>{
  const ids=Array.from(html.matchAll(/\bid="([^"]+)"/g),m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,"Duplicate HTML id");
  for(const id of ["products","algorithms","operators","radiation-platform","validation","sar-imaging"]){
    assert.ok(ids.includes(id),id);
    assert.ok(html.includes('href="#'+id+'"'),id);
  }
  assert.ok(html.indexOf('id="validation"')<html.indexOf('class="validation-details"'));
  assert.ok(html.indexOf('id="products"')<html.indexOf('id="algorithms"'));
  const crypto=require("node:crypto");
  for(const [file,id] of [["orbit.webp","simulation-orbit"],["effects.png","simulation-effects"]]){
    const bytes=fs.readFileSync(path.join(root,"assets/simulation",file));
    assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"),catalog.catalogSources[id].sha256);
  }
});
