"use strict";

// All catalog claims refer to the linked research implementations, not flight qualification.
const products = [
  {id:"sar",category:"board",code:"K7 / CSA",image:"board.svg",style:"sar",tags:["Kintex-7","2048 × 2048","SEM IP"],
    source:"https://github.com/juwadeLone/2048-2048cs-k7-sem",
    zh:{title:"SAR 成像实验平台",type:"FPGA 板卡方案",subtitle:"KINtex-7 · CHIRP SCALING".toUpperCase(),description:"集成定点 CSA 成像与 SEM 故障注入，连接从原始回波到成像结果的验证流程。",detail:"基于已有 Kintex-7 研究平台，提供 SAR 成像与配置存储器故障注入的方案沟通。可围绕你的实验讨论板卡、算法移植及主机工具的交付范围。",specs:[["参考器件","XC7K325T FFG900-2"],["成像规模","2048 × 2048，定点 CSA"],["参考时钟","125 MHz（研究实现）"],["接口","DDR3 / 千兆以太网 UDP / UART"],["实验工具","Xilinx SEM IP，Python 主机脚本"],["参考工具链","Vivado 2018.3"]]},
    en:{title:"SAR imaging platform",type:"FPGA board solution",subtitle:"KINTEX-7 · CHIRP SCALING",description:"Fixed-point CSA imaging with SEM fault injection. Connect raw echoes, FPGA processing and output verification.",detail:"A solution based on the existing Kintex-7 research platform for SAR imaging and configuration-memory fault injection. Board configuration, algorithm porting and host tooling are scoped for your project.",specs:[["Reference device","XC7K325T FFG900-2"],["Image size","2048 × 2048, fixed-point CSA"],["Reference clock","125 MHz (research implementation)"],["Interfaces","DDR3 / Gigabit Ethernet UDP / UART"],["Experiment tools","Xilinx SEM IP, Python host scripts"],["Reference tools","Vivado 2018.3"]]}},
  {id:"fft",category:"ip",code:"IP / FFT",image:"fft.svg",style:"fft",tags:["1024-point","4-lane","SystemVerilog"],
    source:"https://github.com/juwadeLone/fault_tolerant_SDF_FFT_designs",
    zh:{title:"容错流式 FFT",type:"算法与 IP 方案",subtitle:"PARALLEL SDF · ONLINE RECOVERY",description:"四路并行流式 FFT，探索分级纠错与在线恢复，为可靠信号处理提供可研究的 RTL 起点。",detail:"1024 点、四路、十级并行 SDF FFT 的纯 SystemVerilog 研究实现，包括 SubFFT 与 PFFT 架构及其无保护、ECC、TMR 变体。具体授权与集成支持需另行约定。",specs:[["变换规模","1024 点 / 四路并行 / 十级"],["实现语言","SystemVerilog（纯 RTL）"],["容错变体","SubFFT / PFFT，ECC / TMR"],["参考器件","XC7VX690T FFG1761-2"],["参考工具链","Vivado 2022.1"],["交付形态","算法 / IP 集成方案，非独立板卡"]]},
    en:{title:"Fault-tolerant streaming FFT",type:"Algorithm & IP solution",subtitle:"PARALLEL SDF · ONLINE RECOVERY",description:"Four-lane streaming FFT with staged error correction and online recovery, built on inspectable research RTL.",detail:"Pure SystemVerilog research implementations of 1024-point, four-lane, ten-stage SDF FFTs. Includes SubFFT and PFFT baseline, ECC and TMR variants. Licensing and integration support are agreed separately.",specs:[["Transform","1024 points / 4 lanes / 10 stages"],["Implementation","SystemVerilog (pure RTL)"],["Variants","SubFFT / PFFT, ECC / TMR"],["Reference device","XC7VX690T FFG1761-2"],["Reference tools","Vivado 2022.1"],["Delivery","Algorithm / IP integration, not a board"]]}},
  {id:"bp",category:"board",code:"K7 / BP",image:"board.svg",style:"bp",tags:["Back-projection","2 GiB DDR3","Fault injection"],
    source:"https://github.com/juwadeLone/BP_FT_platform",
    zh:{title:"BP 成像与可靠性验证",type:"FPGA 板卡方案",subtitle:"BACK-PROJECTION · FAULT STUDY",description:"将 BP 成像、冗余保护与板级故障注入连接起来，为成像算法的可靠性评估提供实验路径。",detail:"基于 Kintex-7 的 2048 × 2048 定点反投影 SAR 成像研究平台。研究仓库包含 Base-BP、TMR-BP 与运行时检查 RA-BP 的实现及实验记录。",specs:[["参考器件","XC7K325T FFG900-2"],["成像算法","2048 × 2048 定点 BP"],["存储","DDR3，2 GiB（参考平台）"],["主机链路","UDP / SEM IP"],["保护方案","Base-BP / TMR-BP / RA-BP"],["参考工具链","Vivado 2018.3"]]},
    en:{title:"BP imaging & reliability",type:"FPGA board solution",subtitle:"BACK-PROJECTION · FAULT STUDY",description:"Connect BP imaging, redundant protection and board-level fault injection in one traceable research workflow.",detail:"A Kintex-7 research platform for 2048 × 2048 fixed-point back-projection SAR imaging. The source repository includes Base-BP, TMR-BP and runtime-checked RA-BP implementations and experimental records.",specs:[["Reference device","XC7K325T FFG900-2"],["Imaging","2048 × 2048 fixed-point BP"],["Memory","DDR3, 2 GiB (reference platform)"],["Host link","UDP / SEM IP"],["Protection","Base-BP / TMR-BP / RA-BP"],["Reference tools","Vivado 2018.3"]]}}
];

const translations = {
  zh:{
    skip:"跳至正文",navLabel:"主导航",navProducts:"产品与方案",navCapabilities:"技术能力",navResearch:"研究笔记 ↗",navContact:"聊聊你的项目 ↗",
    heroEyebrow:"独立研发 · FPGA 信号处理平台",heroTitle:"让信号处理，<br>走出实验室。<span>走向更远处。</span>",heroDescription:"从 SAR 成像到容错计算，将算法、板卡与验证工具连接起来。为你的下一次星载或机载实验，构建扎实的起点。",
    explore:"探索产品方案 ↗",discuss:"讨论定制需求 →",heroNote:"板卡 × 算法 × 验证<br><strong>不止硬件，更是完整的实验路径。</strong>",boardAlt:"FPGA 信号处理板卡概念示意图，非实际产品照片",visualTitle:"让算法拥有硬件的力量",schematic:"板卡概念示意 · 非实物图",
    productsEyebrow:"01 / 产品与方案",productsTitle:"为你的实验，找到合适的起点。",productsIntro:"基于已有研究平台的方案展示。<br>配置、交付范围与报价，按项目需求确认。",filterLabel:"筛选方案",filterAll:"全部方案 <span>03</span>",filterBoard:"板卡平台",filterIP:"算法与 IP",
    catalogNote:"面向科研与工程评估；上星或装机前的环境适应性、接口及可靠性验证需按任务要求另行确认。",
    capEyebrow:"02 / 从代码，到可信的结果",capTitle:"好算法，需要扎实的工程。",github:"在 GitHub 了解研究 ↗",
    cap1Title:"算法与硬件协同",cap1Body:"定点建模、RTL 实现与板级数据通路协同设计，让仿真结果与硬件输出能够逐项比对。",
    cap2Title:"让可靠性可验证",cap2Body:"结合 SEM 故障注入、冗余保护与错误分类，研究故障如何传播，而不只看一次正确输出。",
    cap3Title:"完整的实验闭环",cap3Body:"从主机控制、数据传输到结果检查，围绕真实实验流程组织工具，保留可追溯的验证记录。",
    processEyebrow:"03 / 合作方式",processTitle:"从一个想法，到一次实验。",processIntro:"直接与开发者沟通。<br>先明确需求，再定义交付。",
    step1Title:"聊清任务",step1Body:"应用场景、信号规模、接口与实验目标。",step2Title:"确认方案",step2Body:"评估平台配置、算法适配与验证范围。",step3Title:"约定交付",step3Body:"书面确认报价、周期、文档与支持内容。",step4Title:"开始验证",step4Body:"按双方约定的测试用例完成集成与验收。",
    inquiryEyebrow:"04 / 开启下一次探索",inquiryTitle:"你的下一次实验，<br>从这里开始。",inquiryIntro:"告诉我你正在解决什么问题。<br>我们一起找到合适的硬件与算法路径。",inquiryNote:"按需报价，不设在线支付。<br>所有配置与交付承诺以双方确认为准。",
    nameLabel:"你的称呼 *",emailLabel:"联系邮箱 *",organizationLabel:"单位 / 团队",interestLabel:"感兴趣的方案 *",scenarioLabel:"实验场景 *",requirementsLabel:"项目需求 *",namePlaceholder:"如何称呼你",organizationPlaceholder:"学校、研究所或公司",requirementsPlaceholder:"例如：SAR 成像，需要千兆网口，计划先进行地面功能验证……",
    privacyNote:"表单不会上传或保存你的信息。将生成邮件草稿，由你在邮箱中确认发送。",compose:"生成询价邮件 ↗",draftLabel:"邮件内容（也可直接复制发送）",openEmail:"打开邮箱 →",copy:"复制内容",download:"下载询价单",footerLine:"独立研发，认真对待每一个信号。",footerResearch:"研究与笔记 ↗",closeLabel:"关闭",
    details:"查看方案 +",quote:"咨询报价 ↗",source:"查看研究来源与技术资料 ↗",deliveryNote:"此处为研究实现的参考参数，不是最终交付承诺；实物配置、供货、授权、价格与星载/机载适用性需沟通确认。",count:n=>n+" 个方案",selectProduct:"请选择方案",custom:"定制 / 暂不确定",selectScenario:"请选择场景",ground:"地面验证",airborne:"机载实验评估",space:"星载实验评估",other:"其他科研用途",draftReady:"询价草稿已生成，尚未发送。请打开邮箱发送，或复制 / 下载后发送至上方邮箱。",copied:"已复制，发送至 1906233797@qq.com 即可。",copyFallback:"请手动复制已选中的邮件内容。",whitespace:"请填写有效内容，不能只输入空格。",mailSubject:"方案询价",mailName:"称呼",mailEmail:"联系邮箱",mailOrg:"单位 / 团队",mailProduct:"感兴趣的方案",mailScenario:"实验场景",mailRequirements:"项目需求",notProvided:"未填写"
  },
  en:{
    skip:"Skip to content",navLabel:"Main navigation",navProducts:"Solutions",navCapabilities:"Capabilities",navResearch:"Research ↗",navContact:"Let's talk ↗",
    heroEyebrow:"INDEPENDENT ENGINEERING · FPGA SYSTEMS",heroTitle:"Beyond the lab.<br>Closer to your<span>next mission.</span>",heroDescription:"From SAR imaging to fault-tolerant computing. Connect algorithms, FPGA boards and verification tools to build a solid foundation for airborne and spaceborne experiments.",
    explore:"Explore solutions ↗",discuss:"Discuss your project →",heroNote:"Hardware × Algorithms × Verification<br><strong>More than a board. A path to your next experiment.</strong>",boardAlt:"Concept illustration of an FPGA processing board, not a product photograph",visualTitle:"Give your algorithms a hardware edge",schematic:"Concept illustration · not a product photo",
    productsEyebrow:"01 / PRODUCTS & SOLUTIONS",productsTitle:"Find your experiment's starting point.",productsIntro:"Solutions rooted in existing research platforms.<br>Configuration, scope and pricing are agreed per project.",filterLabel:"Filter solutions",filterAll:"All solutions <span>03</span>",filterBoard:"Board platforms",filterIP:"Algorithms & IP",
    catalogNote:"For research and engineering evaluation. Environmental, interface and reliability requirements must be verified for each airborne or spaceborne mission.",
    capEyebrow:"02 / FROM CODE TO CONFIDENCE",capTitle:"Good algorithms. Solid engineering.",github:"Explore the research on GitHub ↗",
    cap1Title:"Hardware meets algorithms",cap1Body:"Fixed-point models, RTL and board-level data paths designed together, so simulation and hardware outputs can be compared.",
    cap2Title:"Reliability you can investigate",cap2Body:"SEM fault injection, redundant protection and error classification reveal how faults propagate, beyond a single correct result.",
    cap3Title:"A complete experiment loop",cap3Body:"Host control, data transfer and output checks organized around real experiments, with traceable verification records.",
    processEyebrow:"03 / WORKING TOGETHER",processTitle:"From an idea to an experiment.",processIntro:"Talk directly to the developer.<br>Understand the need. Then define the delivery.",
    step1Title:"Define the mission",step1Body:"Your application, signal size, interfaces and experiment goals.",step2Title:"Shape the solution",step2Body:"Evaluate hardware, algorithm adaptation and validation scope.",step3Title:"Agree on delivery",step3Body:"Confirm pricing, timeline, documentation and support in writing.",step4Title:"Start verifying",step4Body:"Integrate and accept against the test cases we agree on.",
    inquiryEyebrow:"04 / YOUR NEXT EXPLORATION",inquiryTitle:"Your next experiment<br>starts here.",inquiryIntro:"Tell me about the problem you're solving.<br>Let's find the right hardware and algorithm path.",inquiryNote:"Project-based quotes. No online payments.<br>Configuration and delivery are confirmed together.",
    nameLabel:"Your name *",emailLabel:"Email address *",organizationLabel:"Organization / team",interestLabel:"Solution of interest *",scenarioLabel:"Experiment setting *",requirementsLabel:"Project requirements *",namePlaceholder:"What should I call you?",organizationPlaceholder:"University, institute or company",requirementsPlaceholder:"For example: SAR imaging, Gigabit Ethernet, starting with ground-based functional verification…",
    privacyNote:"Nothing is uploaded or stored. This form creates an email draft for you to review and send from your email app.",compose:"Prepare inquiry email ↗",draftLabel:"Email draft (you can also copy and send it)",openEmail:"Open email app →",copy:"Copy text",download:"Download inquiry",footerLine:"Independent engineering. Every signal matters.",footerResearch:"Research & notes ↗",closeLabel:"Close",
    details:"View solution +",quote:"Request a quote ↗",source:"View research source & technical details ↗",deliveryNote:"These are reference research specifications, not a delivery commitment. Hardware, availability, licensing, pricing and mission suitability are confirmed individually.",count:n=>n+(n===1?" solution":" solutions"),selectProduct:"Choose a solution",custom:"Custom / not sure yet",selectScenario:"Choose a setting",ground:"Ground verification",airborne:"Airborne evaluation",space:"Spaceborne evaluation",other:"Other research",draftReady:"Draft prepared — not sent. Open your email app, or copy / download the text and send it to the address above.",copied:"Copied. Send it to 1906233797@qq.com.",copyFallback:"Please copy the selected email text manually.",whitespace:"Please enter text, not only spaces.",mailSubject:"Solution inquiry",mailName:"Name",mailEmail:"Email",mailOrg:"Organization / team",mailProduct:"Solution",mailScenario:"Experiment setting",mailRequirements:"Requirements",notProvided:"Not provided"
  }
};

function buildInquiry(data,strings,productTitle,scenarioTitle){
  const subject=strings.mailSubject+" — "+productTitle;
  const body=[
    strings.mailName+": "+data.name.trim(),
    strings.mailEmail+": "+data.email.trim(),
    strings.mailOrg+": "+(data.organization.trim()||strings.notProvided),
    strings.mailProduct+": "+productTitle,
    strings.mailScenario+": "+scenarioTitle,
    "",strings.mailRequirements+":",data.requirements.trim()
  ].join("\n");
  return {subject,body,text:subject+"\n\n"+body,mailto:"mailto:1906233797@qq.com?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body)};
}

let language="zh";
try { language=new URLSearchParams(location.search).get("lang") || localStorage.getItem("juwade-language") || "zh"; } catch {}
if(!["zh","en"].includes(language)) language="zh";
let activeFilter="all";
let activeProduct=null;
let lastDialogTrigger=null;
const $=selector=>document.querySelector(selector);
const t=key=>translations[language][key];
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));

function renderProducts(){
  const visible=products.filter(product=>activeFilter==="all" || product.category===activeFilter);
  $("#product-grid").innerHTML=visible.map(product=>{
    const p=product[language];
    return `<article class="product-card"><div class="product-art ${product.style}"><span class="art-index">${product.code}</span><img src="assets/${product.image}" alt="${escapeHtml(product.id==="fft"?p.title:t("boardAlt"))}" width="660" height="490" loading="lazy"><span class="art-type">${product.id==="fft"?"SIGNAL FLOW":t("schematic")}</span></div><div class="product-info"><p class="product-category">${p.type}</p><h3>${p.title}</h3><p class="product-subtitle">${p.subtitle}</p><p class="product-description">${p.description}</p><div class="spec-chips">${product.tags.map(tag=>`<span>${tag}</span>`).join("")}</div><div class="product-bottom"><button type="button" data-details="${product.id}" aria-label="${p.title} — ${t("details")}">${t("details")}</button><button type="button" class="quote" data-quote="${product.id}" aria-label="${p.title} — ${t("quote")}">${t("quote")}</button></div></div></article>`;
  }).join("");
  $("#product-count").textContent=t("count")(visible.length);
}
function renderOptions(){
  const interest=$("#interest"),scenario=$("#scenario"),oldProduct=interest.value,oldScenario=scenario.value;
  interest.innerHTML=`<option value="">${t("selectProduct")}</option>`+products.map(product=>`<option value="${product.id}">${product[language].title}</option>`).join("")+`<option value="custom">${t("custom")}</option>`;
  scenario.innerHTML=`<option value="">${t("selectScenario")}</option>`+["ground","airborne","space","other"].map(value=>`<option value="${value}">${t(value)}</option>`).join("");
  interest.value=oldProduct; scenario.value=oldScenario;
}
function renderDialog(product){
  const p=product[language];
  $("#dialog-content").innerHTML=`<p class="dialog-eyebrow">${product.code}</p><h2 id="dialog-title">${p.title}</h2><p>${p.detail}</p><dl>${p.specs.map(([key,value])=>`<div><dt>${key}</dt><dd>${value}</dd></div>`).join("")}</dl><a class="source-link" href="${product.source}" target="_blank" rel="noopener noreferrer">${t("source")}</a><p class="dialog-note">${t("deliveryNote")}</p><button class="button" type="button" data-quote="${product.id}">${t("quote")}</button>`;
}
function chooseProduct(id){
  $("#interest").value=id;
  if($("#product-dialog").open) $("#product-dialog").close();
  clearDraft();
  $("#inquiry").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
  $("#interest").focus({preventScroll:true});
}
function setLanguage(){
  document.documentElement.lang=language==="zh"?"zh-CN":"en";
  document.title=language==="zh"?"juwade · 信号处理，从算法到实验":"juwade · FPGA signal processing, from algorithm to experiment";
  document.querySelector('meta[name="description"]').content=language==="zh"?"juwade · 面向星载与机载实验评估的 FPGA 信号处理方案。SAR 成像、容错 FFT 与硬件在环验证。":"FPGA signal processing solutions for airborne and spaceborne research evaluation. SAR imaging, fault-tolerant FFT and hardware-in-the-loop verification.";
  document.querySelectorAll("[data-i18n]").forEach(element=>element.innerHTML=t(element.dataset.i18n));
  document.querySelectorAll("[data-placeholder]").forEach(element=>element.placeholder=t(element.dataset.placeholder));
  document.querySelectorAll("[data-label]").forEach(element=>element.setAttribute("aria-label",t(element.dataset.label)));
  document.querySelectorAll("[data-alt]").forEach(element=>element.alt=t(element.dataset.alt));
  $("#language").textContent=language==="zh"?"EN ⌄":"中文 ⌄";
  $("#language").setAttribute("aria-label",language==="zh"?"Switch to English":"切换到中文");
  document.querySelectorAll("input,textarea").forEach(element=>element.setCustomValidity(""));
  renderProducts(); renderOptions();
  if(activeProduct)renderDialog(activeProduct);
  if(!$("#email-draft").hidden) prepareDraft();
  try{localStorage.setItem("juwade-language",language);}catch{}
}
function clearDraft(){
  $("#email-draft").hidden=true;
  $("#form-status").textContent="";
  $("#draft-text").value="";
  $("#open-email").href="mailto:1906233797@qq.com";
}
function prepareDraft(){
  const data=new FormData($("#inquiry-form"));
  const product=products.find(p=>p.id===data.get("product"));
  const productTitle=product?product[language].title:t("custom");
  const draft=buildInquiry(Object.fromEntries(data),translations[language],productTitle,t(data.get("scenario")));
  $("#draft-text").value=draft.text;
  $("#open-email").href=draft.mailto;
  $("#email-draft").hidden=false;
  $("#form-status").textContent=t("draftReady");
}
$("#language").addEventListener("click",()=>{
  language=language==="zh"?"en":"zh";
  const url=new URL(location.href);url.searchParams.set("lang",language);
  history.replaceState(null,"",url);
  setLanguage();
});
document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>{
  activeFilter=button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(filter=>{
    const active=filter===button;filter.classList.toggle("active",active);filter.setAttribute("aria-pressed",String(active));
  });
  renderProducts();
}));
document.addEventListener("click",event=>{
  const details=event.target.closest("[data-details]"),quote=event.target.closest("[data-quote]");
  if(details){activeProduct=products.find(p=>p.id===details.dataset.details);lastDialogTrigger=details;renderDialog(activeProduct);$("#product-dialog").showModal();}
  if(quote)chooseProduct(quote.dataset.quote);
});
$(".dialog-close").addEventListener("click",()=>$("#product-dialog").close());
$("#product-dialog").addEventListener("click",event=>{if(event.target===$("#product-dialog")){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
$("#product-dialog").addEventListener("close",()=>{activeProduct=null;if(lastDialogTrigger?.isConnected)lastDialogTrigger.focus({preventScroll:true});});
$("#inquiry-form").addEventListener("input",event=>{event.target.setCustomValidity("");clearDraft();});
$("#inquiry-form").addEventListener("change",clearDraft);
$("#inquiry-form").addEventListener("submit",event=>{
  event.preventDefault();
  for(const element of event.currentTarget.querySelectorAll("[required]")){
    element.setCustomValidity(element.value.trim()?"":t("whitespace"));
  }
  if(!event.currentTarget.reportValidity())return;
  prepareDraft();
});
$("#copy-draft").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText($("#draft-text").value);$("#form-status").textContent=t("copied");}
  catch{$("#draft-text").focus();$("#draft-text").select();$("#form-status").textContent=t("copyFallback");}
});
$("#download-draft").addEventListener("click",()=>{
  const url=URL.createObjectURL(new Blob(["\uFEFF"+$("#draft-text").value],{type:"text/plain;charset=utf-8"}));
  const link=document.createElement("a");link.href=url;link.download="juwade-inquiry.txt";document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$("#year").textContent=new Date().getFullYear();
setLanguage();
