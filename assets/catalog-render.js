"use strict";
function sourceLinks(ids){
  return ids.map((id,index)=>{
    const source=catalogSources[id];
    return `<a class="source-link" href="${source.url}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(source.path)}">${t("sourceFile")} ${index+1} ↗</a>`;
  }).join("");
}
function catalogCard(product){
  const p=product[language];
  const art=product.image?`<div class="product-art ${product.style}"><span class="art-index">${product.code}</span><img src="assets/${product.image}" alt="${escapeHtml(t("boardAlt"))}" width="660" height="490" loading="lazy"><span class="art-type">${t("schematic")}</span></div>`:`<div class="primitive-symbol" aria-hidden="true">${product.code}</div>`;
  return `<article class="product-card" data-category="${product.category}" data-product="${product.id}">${art}<div class="product-info"><p class="product-category">${p.type}</p><h3>${p.title}</h3><p class="product-subtitle">${p.subtitle}</p><p class="product-description">${p.description}</p><dl class="catalog-specs">${p.specs.map(([key,value])=>`<div><dt>${key}</dt><dd>${value}</dd></div>`).join("")}</dl><div class="product-bottom"><button type="button" data-details="${product.id}" aria-label="${p.title} — ${t("details")}">${t("details")}</button><button type="button" class="quote" data-quote="${product.id}" aria-label="${p.title} — ${t("quote")}">${t("quote")}</button></div>${product.datasheet?`<a class="datasheet-link" href="datasheets/${product.datasheet}.html">${t("datasheet")} ↗</a>`:""}<a class="repository-link" href="${product.source}" target="_blank" rel="noopener noreferrer">${t("source")}</a></div></article>`;
}
function renderProducts(){
  const openCases=new Set(Array.from($("#case-grid").querySelectorAll("details[open]"),details=>details.dataset.case));
  const boards=products.filter(product=>product.category==="board");
  $("#product-grid").innerHTML=boards.map(catalogCard).join("");
  $("#operator-grid").innerHTML=products.filter(product=>product.category==="operator").map(catalogCard).join("");
  $("#product-count").textContent=t("count")(boards.length);
  $("#case-grid").innerHTML=catalogData.cases.map(item=>{
    const c=item[language];
    return `<article class="case-card"><p class="eyebrow">${item.board} / ${item.id.toUpperCase()}</p><h3>${c.title}</h3><dl><div><dt>${t("caseFormat")}</dt><dd>${c.format}</dd></div><div><dt>${t("caseTiming")}</dt><dd>${c.timing}</dd></div></dl><p>${c.result}</p><details data-case="${item.id}"${openCases.has(item.id)?" open":""}><summary>${t("validationSources")}</summary>${sourceLinks(item.sourceIds)}</details></article>`;
  }).join("");
}
function renderDialog(product){
  const p=product[language];
  $("#dialog-content").innerHTML=`<p class="dialog-eyebrow">${product.code}</p><h2 id="dialog-title">${p.title}</h2><p>${p.detail}</p><dl>${p.specs.map(([key,value])=>`<div><dt>${key}</dt><dd>${value}</dd></div>`).join("")}</dl>${sourceLinks(product.sourceIds)}<a class="source-link" href="assets/catalog-provenance.json">${t("catalogProvenance")}</a>${product.datasheet?`<a class="source-link" href="datasheets/${product.datasheet}.html">${t("datasheet")} ↗</a>`:""}<p class="dialog-note">${t("source")} · ${t("deliveryNote")}</p><button class="button" type="button" data-quote="${product.id}">${t("quote")}</button>`;
}
