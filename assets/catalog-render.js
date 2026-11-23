"use strict";
function catalogCard(product){
  const p=product[language];
  const art=product.image?`<div class="product-art ${product.style}"><span class="art-index">${product.code}</span><img src="assets/${product.image}" alt="${escapeHtml(t("boardAlt"))}" width="660" height="490" loading="lazy"><span class="art-type">${t("schematic")}</span></div>`:`<div class="primitive-symbol" aria-hidden="true">${product.code}</div>`;
  return `<article class="product-card" data-category="${product.category}" data-product="${product.id}">${art}<div class="product-info"><p class="product-category">${p.type}</p><h3>${p.title}</h3><p class="product-subtitle">${p.subtitle}</p><p class="product-description">${p.description}</p><dl class="catalog-specs">${p.specs.map(([key,value])=>`<div><dt>${key}</dt><dd>${value}</dd></div>`).join("")}</dl><div class="product-bottom"><button type="button" data-details="${product.id}" aria-label="${p.title} — ${t("details")}">${t("details")}</button><button type="button" class="quote" data-quote="${product.id}" aria-label="${p.title} — ${t("quote")}">${t("quote")}</button></div>${product.datasheet?`<a class="datasheet-link" href="datasheets/${product.datasheet}.html">${t("datasheet")} ↗</a>`:""}</div></article>`;
}
function serviceCard(service,index){
  const s=service[language];
  return `<article class="service-card${service.featured?" featured":""}" data-service="${service.id}"><span class="service-number">${String(index+1).padStart(2,"0")}</span>${service.featured?`<span class="service-badge">${t("serviceFeatured")}</span>`:""}<h3>${s.title}</h3><p class="service-who"><strong>${t("serviceWho")}</strong>${s.who}</p><ul>${s.items.map(item=>`<li>${item}</li>`).join("")}</ul>${service.featured?`<a class="service-link" href="#radiation-platform">${t("serviceFeatureLink")}</a>`:""}<button type="button" data-quote="${service.id}" aria-label="${s.title} — ${t("serviceCta")}">${t("serviceCta")}</button></article>`;
}
function renderProducts(){
  const boards=products.filter(product=>product.category==="board");
  $("#service-grid").innerHTML=services.map(serviceCard).join("");
  $("#product-grid").innerHTML=boards.map(catalogCard).join("");
  $("#operator-grid").innerHTML=products.filter(product=>product.category==="operator").map(catalogCard).join("");
  $("#product-count").textContent=t("count")(boards.length);
  $("#case-grid").innerHTML=catalogData.cases.map(item=>{
    const c=item[language];
    return `<article class="case-card"><p class="eyebrow">${item.board}</p><h3>${c.title}</h3><dl><div><dt>${t("caseFormat")}</dt><dd>${c.format}</dd></div>${c.timing?`<div><dt>${t("caseTiming")}</dt><dd>${c.timing}</dd></div>`:""}</dl><p>${c.result}</p></article>`;
  }).join("");
}
function renderDialog(product){
  const p=product[language];
  $("#dialog-content").innerHTML=`<p class="dialog-eyebrow">${product.code}</p><h2 id="dialog-title">${p.title}</h2><p>${p.detail}</p><dl>${p.specs.map(([key,value])=>`<div><dt>${key}</dt><dd>${value}</dd></div>`).join("")}</dl>${product.datasheet?`<a class="source-link" href="datasheets/${product.datasheet}.html">${t("datasheet")} ↗</a>`:""}<p class="dialog-note">${t("deliveryNote")}</p><button class="button" type="button" data-quote="${product.id}">${t("quote")}</button>`;
}
