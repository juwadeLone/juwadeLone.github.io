const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"assets/site.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
// The content and draft builder are pure. Do not simulate or replace browser behavior.
const catalog=vm.runInNewContext(source.slice(0,source.indexOf('let language="zh";'))+';({products,translations,buildInquiry});');

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
  for(const product of catalog.products)assert.ok(fs.existsSync(path.join(root,"assets",product.image)));
  assert.ok(fs.readFileSync(path.join(root,"research.html"),"utf8").includes("orbit_radiation.json"));
});
test("each catalog solution has bilingual reference specs and a real source URL",()=>{
  assert.equal(new Set(catalog.products.map(product=>product.id)).size,3);
  for(const product of catalog.products){
    assert.match(product.source,/^https:\/\/github\.com\/juwadeLone\//);
    for(const locale of ["zh","en"]){
      assert.ok(product[locale].title);
      assert.equal(product[locale].specs.length,6);
    }
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
  }
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
test("every solution has an offline datasheet and commit-pinned, digest-identified evidence",()=>{
  for(const product of catalog.products){
    const sheet=fs.readFileSync(path.join(root,"datasheets",product.id+".html"),"utf8");
    assert.ok(sheet.includes("window.print()"));
    assert.ok(sheet.includes('download="juwade-'+product.id+'-datasheet.html"'));
    const evidence=JSON.parse(fs.readFileSync(path.join(root,"datasheets",product.id+".json"),"utf8"));
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
