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
