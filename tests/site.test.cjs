const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"assets/site.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const htmlEn=fs.readFileSync(path.join(root,"index_en.html"),"utf8");
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
test("all local page assets and research entry point resolve",()=>{
  for(const page of [html,htmlEn]){
    for(const [,raw] of page.matchAll(/(?:src|href)="([^"]+)"/g)){
      const reference=raw.split("?")[0];
      if(/^(?:https?:|mailto:|#)/.test(reference))continue;
      assert.ok(fs.existsSync(path.join(root,reference)),reference);
    }
  }
  for(const product of catalog.products.filter(p=>p.image))assert.ok(fs.existsSync(path.join(root,"assets",product.image)));
  assert.ok(fs.readFileSync(path.join(root,"research.html"),"utf8").includes("orbit_radiation.json"));
});
test("Chinese and English pages mirror section ids, cross-link and share the brochures",()=>{
  const ids=page=>[...page.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map(m=>m[1]).sort();
  assert.deepEqual(ids(htmlEn),ids(html));
  assert.ok(html.includes('<html lang="zh-CN"')&&htmlEn.includes('<html lang="en"'));
  assert.ok(html.includes('href="index_en.html"'),"CN page links to EN");
  assert.ok(htmlEn.includes('href="index.html"'),"EN page links to CN");
  for(const page of [html,htmlEn]){
    for(const pdf of ["FPGA_IP_Licensing_CN.pdf","FPGA_IP_Licensing_EN.pdf"])assert.ok(page.includes(pdf),pdf);
  }
  for(const pdf of ["FPGA_IP_Licensing_CN.pdf","FPGA_IP_Licensing_EN.pdf"]){
    assert.equal(fs.readFileSync(path.join(root,pdf)).toString("ascii",0,4),"%PDF",pdf);
  }
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

test("radiation lab ships real spectra, anchored rates and bilingual strings",()=>{
  const lab=fs.readFileSync(path.join(root,"radiation-lab.html"),"utf8");
  for(const page of [html,htmlEn])assert.ok(page.includes('href="radiation-lab.html"'),"homepage links the lab");
  const spectra=JSON.parse(fs.readFileSync(path.join(root,"assets/radiation/spenvis_creme96_gcr_spectra.json"),"utf8"));
  assert.deepEqual(Object.keys(spectra).sort(),["C","Fe","H","He","Mg","O","Si"]);
  for(const pts of Object.values(spectra)){
    assert.ok(pts.length>50,"dense LET grid");
    for(const [l,f] of pts){assert.ok(l>0&&f>=0);}
  }
  const prov=JSON.parse(fs.readFileSync(path.join(root,"assets/radiation/provenance.json"),"utf8"));
  assert.ok(prov.weibull_source.includes("10.1109/REDW.2014.7004595"));
  for(const text of ["devRate:20.8","devRate:25.3","devRate:0.09","229878496","54190080","866400","3.34e-8","3.82e-8","1.47e-7"]){
    assert.ok(lab.includes(text),text);
  }
  const zhBlock=lab.slice(lab.indexOf("zh:{"),lab.indexOf("\nen:{"));
  const enBlock=lab.slice(lab.indexOf("\nen:{"),lab.indexOf("let lang"));
  const keys=b=>[...b.matchAll(/^ {0,2}(\"?[a-z0-9\-]+\"?):/gm)].map(m=>m[1].replace(/"/g,"")).filter(k=>k!=="zh"&&k!=="en").sort();
  assert.deepEqual(keys(enBlock),keys(zhBlock),"zh/en i18n keys must match");
  assert.ok(lab.includes("autorun"),"autorun param for embedding/tests");
});

test("measured SAR figures keep file digests and show no citations on the page",()=>{
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
    const displayed=fs.readFileSync(path.join(root,"assets/sar",scene.file));
    assert.equal(crypto.createHash("sha256").update(displayed).digest("hex"),scene.sha256,scene.file);
    assert.ok(html.includes('src="assets/sar/'+scene.file+'"'),scene.file);
    assert.ok(htmlEn.includes('src="assets/sar/'+scene.file+'"'),scene.file);
  }
  assert.doesNotMatch(html,/assets\/sar\/scenes\/|jpl\.nasa\.gov|NASA\/JPL/);
  const visible=html+JSON.stringify(catalog.translations);
  assert.doesNotMatch(visible,/doi\.org|IEEE|论文|课题组|Second Brain|research group|provenance\.json"[^>]*sceneProvenance/i);
});

test("visitor-facing page has no links that require private access",()=>{
  const render=fs.readFileSync(path.join(root,"assets/catalog-render.js"),"utf8");
  assert.doesNotMatch(render,/repository-link|catalogSources|catalog-provenance/);
  assert.doesNotMatch(html,/github\.com\/juwadeLone\/[^"]+\/blob\/|devinapps|catalog-provenance\.json|download="juwade-\w+-evidence\.json"/);
});
test("services are bilingual, quotable and rendered into the services section",()=>{
  assert.ok(html.includes('id="services"'));
  const section=html.slice(html.indexOf('id="services"'),html.indexOf('id="radiation"'));
  assert.ok((section.match(/<article class="card/g)||[]).length>=4,"service cards");
  assert.ok(section.includes("抗辐射"),"featured reliability service present");
  assert.ok(catalog.catalogData.services.length>=4);
  for(const service of catalog.catalogData.services){
    for(const locale of ["zh","en"]){
      assert.ok(service[locale].title);
      assert.ok(service[locale].who);
      assert.ok(service[locale].items.length>=3);
    }
  }
  assert.ok(catalog.catalogData.services.some(service=>service.id==="reliability"));
});
test("buyer-facing catalog labels compute the total",()=>{
  for(const locale of ["zh","en"]){
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
  for(const id of ["services","radiation","injection","boards","imaging","algorithms","cases","ip","solutions","license","downloads","audience","about","faq","inquiry"]){
    assert.ok(ids.includes(id),id);
  }
  for(const id of ["services","radiation","injection","boards","imaging","ip","license","about","faq","inquiry"]){
    assert.ok(html.includes('href="#'+id+'"'),id);
  }
  assert.ok(html.indexOf('id="services"')<html.indexOf('id="radiation"'));
  assert.ok(html.indexOf('id="radiation"')<html.indexOf('id="injection"'));
  assert.ok(html.indexOf('id="injection"')<html.indexOf('id="boards"'));
  assert.ok(html.indexOf('id="ip"')<html.indexOf('id="license"'));
  assert.match(html,/<meta property="og:image" content="https:\/\/juwadelone\.github\.io\/assets\/sar\/papers\/dubai-no-cfbp\.webp">/);
  assert.ok(fs.existsSync(path.join(root,"assets/sar/papers/dubai-no-cfbp.webp")));
  const crypto=require("node:crypto");
  for(const [file,id] of [["orbit.webp","simulation-orbit"],["effects.png","simulation-effects"]]){
    const bytes=fs.readFileSync(path.join(root,"assets/simulation",file));
    assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"),catalog.catalogSources[id].sha256);
  }
});
test("radiation section keeps measured KPIs, the bit-strike demo and stated model limits",()=>{
  const section=html.slice(html.indexOf('id="radiation"'),html.indexOf('id="injection"'));
  assert.ok(html.indexOf('id="services"')<html.indexOf('id="radiation"'),"Featured platform follows services");
  for(const text of ["46.2","≈ 31","&lt; 10%","&lt; 20%","Geant4","XC7VX690T","MEO 20200","20.8","25.3","0.09"]){
    assert.ok(section.includes(text),text);
  }
  assert.ok(section.includes('id="bits"')&&section.includes('id="strike"'),"bit-strike demo present");
  for(const text of ["SPENVIS","Weibull","IGRF-13"])assert.ok(section.includes(text),text);
  assert.doesNotMatch(section,/github\.com|Lee et al|doi\.org/);
  assert.ok(catalog.catalogData.services.find(service=>service.id==="reliability").featured);
});
test("board-level injection data is internally consistent and matches the headline numbers",()=>{
  const data=vm.runInNewContext(fs.readFileSync(path.join(root,"assets/injection-data.js"),"utf8")+";injectionData");
  const section=html.slice(html.indexOf('id="injection"'),html.indexOf('id="boards"'));
  const wilson=(k,n)=>{const z=1.96,p=k/n,d=1+z*z/n,c=(p+z*z/(2*n))/d,h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return[c-h,c+h];};
  const builds=data.chains.flatMap(chain=>chain.builds);
  assert.equal(builds.length,10);
  assert.equal(builds.reduce((sum,b)=>sum+b.n,0),12000);
  for(const b of builds){
    assert.equal(b.fail,b.below+b.due,b.id);
    assert.equal(b.n,b.identical+b.changed+b.below+b.due,b.id);
    assert.equal(b.vuln,Math.round(b.fail/b.n*b.pool),b.id);
    const ci=wilson(b.fail,b.n);
    assert.ok(Math.abs(b.shareCi[0]-ci[0])<1e-12&&Math.abs(b.shareCi[1]-ci[1])<1e-12,b.id);
    assert.ok(b.zh&&b.en);
  }
  const [csa,bp]=data.chains;
  assert.equal(csa.builds.length,7);
  assert.ok(csa.builds.every(b=>b.util&&b.util.dsp>0));
  const ratio=(chain,id)=>chain.builds[0].vuln/chain.builds.find(b=>b.id===id).vuln;
  assert.equal(Math.round(ratio(csa,"TMR17")),15);
  assert.equal(Math.round(ratio(bp,"P7C")),11);
  assert.equal(Math.round(ratio(csa,"GR17")),4);
  for(const text of ["12,000","588,206","TMR17","35,176","5.8%","6.9%","173","493"]){
    assert.ok(section.includes(text),text);
  }
  const bpSheet=JSON.parse(fs.readFileSync(path.join(root,"datasheets/bp.json"),"utf8"));
  for(const b of bp.builds)assert.ok(Math.abs(b.vuln-bpSheet.builds[b.id].failure.xsec)<1,b.id);
  for(const source of data.sources)assert.match(source.sha256,/^[a-f0-9]{64}$/);
});
