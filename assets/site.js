"use strict";

// All catalog claims refer to the linked research implementations, not flight qualification.
const products = [
  {id:"sar",category:"board",code:"SAR imaging board",image:"board.svg",style:"sar",tags:["Kintex-7","2048 × 2048","SEM IP"],
    source:"https://github.com/juwadeLone/2048-2048cs-k7-sem",
    zh:{title:"SAR 成像实验平台",type:"FPGA 板卡方案",subtitle:"KINtex-7 · CHIRP SCALING".toUpperCase(),description:"集成定点 CSA 成像与 SEM 故障注入，连接从原始回波到成像结果的验证流程。",detail:"基于已有 Kintex-7 研究平台，提供 SAR 成像与配置存储器故障注入的方案沟通。可围绕你的实验讨论板卡、算法移植及主机工具的交付范围。",specs:[["参考器件","XC7K325T FFG900-2"],["成像规模","2048 × 2048，定点 CSA"],["参考时钟","125 MHz（研究实现）"],["接口","DDR3 / 千兆以太网 UDP / UART"],["实验工具","Xilinx SEM IP，Python 主机脚本"],["参考工具链","Vivado 2018.3"]]},
    en:{title:"SAR imaging platform",type:"FPGA board solution",subtitle:"KINTEX-7 · CHIRP SCALING",description:"Chirp scaling algorithm (CSA) imaging with Xilinx Soft Error Mitigation (SEM) IP for fault injection and configuration-memory scrubbing.",detail:"A solution based on the existing Kintex-7 research platform for SAR imaging and configuration-memory fault injection. Board configuration, algorithm porting and host tooling are scoped for your project.",specs:[["Reference device","XC7K325T FFG900-2"],["Image size","2048 × 2048, fixed-point CSA"],["Reference clock","125 MHz (research implementation)"],["Interfaces","DDR3 / Gigabit Ethernet UDP / UART"],["Experiment tools","Xilinx SEM IP, Python host scripts"],["Reference tools","Vivado 2018.3"]]}},
  {id:"fft",category:"ip",code:"Streaming FFT IP",image:"fft.svg",style:"fft",tags:["1024-point","4-lane","SystemVerilog"],
    source:"https://github.com/juwadeLone/fault_tolerant_SDF_FFT_designs",
    zh:{title:"容错流式 FFT",type:"算法与 IP 方案",subtitle:"PARALLEL SDF · ONLINE RECOVERY",description:"四路并行流式 FFT，探索分级纠错与在线恢复，为可靠信号处理提供可研究的 RTL 起点。",detail:"1024 点、四路、十级并行 SDF FFT 的纯 SystemVerilog 研究实现，包括 SubFFT 与 PFFT 架构及其无保护、ECC、TMR 变体。具体授权与集成支持需另行约定。",specs:[["变换规模","1024 点 / 四路并行 / 十级"],["实现语言","SystemVerilog（纯 RTL）"],["容错变体","SubFFT / PFFT，ECC / TMR"],["参考器件","XC7VX690T FFG1761-2"],["参考工具链","Vivado 2022.1"],["交付形态","算法 / IP 集成方案，非独立板卡"]]},
    en:{title:"Fault-tolerant streaming FFT",type:"Algorithm & IP solution",subtitle:"STREAMING TRANSFORM · ONLINE RECOVERY",description:"Four-lane streaming fast Fourier transform (FFT) with staged error correction and online recovery, based on research RTL.",detail:"Pure SystemVerilog research implementations of 1024-point, four-lane, ten-stage single-path delay-feedback (SDF) FFTs. SubFFT uses a sub-transform decomposition; PFFT is the alternative parallel-transform mapping. Both include baseline, error-correcting code (ECC) and triple modular redundancy (TMR) variants. Licensing and integration support are agreed separately.",specs:[["Transform","1024 points / 4 lanes / 10 stages"],["Implementation","SystemVerilog (pure RTL)"],["Variants","SubFFT / PFFT, ECC / TMR"],["Reference device","XC7VX690T FFG1761-2"],["Reference tools","Vivado 2022.1"],["Delivery","Algorithm / IP integration, not a board"]]}},
  {id:"bp",category:"board",code:"Back-projection board",image:"board.svg",style:"bp",tags:["Back-projection","2 GiB DDR3","Fault injection"],
    source:"https://github.com/juwadeLone/BP_FT_platform",
    zh:{title:"BP 成像与可靠性验证",type:"FPGA 板卡方案",subtitle:"BACK-PROJECTION · FAULT STUDY",description:"将 BP 成像、冗余保护与板级故障注入连接起来，为成像算法的可靠性评估提供实验路径。",detail:"基于 Kintex-7 的 2048 × 2048 定点反投影 SAR 成像研究平台。研究仓库包含 Base-BP、TMR-BP 与运行时检查 RA-BP 的实现及实验记录。",specs:[["参考器件","XC7K325T FFG900-2"],["成像算法","2048 × 2048 定点 BP"],["存储","DDR3，2 GiB（参考平台）"],["链路与纠错","UDP / SEM IP"],["保护方案","Base-BP / TMR-BP / RA-BP"],["参考工具链","Vivado 2018.3"]]},
    en:{title:"Back-projection (BP) imaging & reliability",optionTitle:"BP imaging & reliability",type:"FPGA board solution",subtitle:"BACK-PROJECTION · FAULT STUDY",description:"Connect back-projection (BP) imaging, redundant protection and board-level fault injection in one traceable research workflow.",detail:"A Kintex-7 research platform for 2048 × 2048 fixed-point back-projection SAR imaging. The access-restricted source includes baseline back-projection (Base-BP), triple-modular-redundant back-projection (TMR-BP) and RA-BP, a back-projection design with runtime checks and replicas, plus experimental records.",specs:[["Reference device","XC7K325T FFG900-2"],["Imaging","2048 × 2048 fixed-point BP"],["Memory","DDR3, 2 GiB (reference platform)"],["Host link & mitigation","UDP / SEM IP"],["Protection","Base-BP / TMR-BP / RA-BP"],["Reference tools","Vivado 2018.3"]]}}
];

const translations = {
  zh:{
    navSAR:"SAR 成像",
    sarEyebrow:"02 / SAR 图像与算法",
    sarTitle:"从回波，到清晰的聚焦。",
    sarIntro:"合成孔径雷达（SAR）利用回波时延分辨距离，利用平台运动形成合成孔径，再通过相干处理完成二维成像。",
    sarBoardKind:"合成输入 · 板级输出",
    sarBoardTitle:"九点目标，检验二维聚焦。",
    sarBoardBody:"Kintex-7 CSA 平台的 3 × 3 点目标成像。左侧查看目标分布，右侧放大中心点响应；用于检查聚焦形状与目标位置，不代表地物遥感影像。",
    sarFocusKind:"合成输入 · 浮点参考",
    sarFocusTitle:"看见主瓣，也看见旁瓣。",
    sarFocusBody:"单点目标的参考成像、峰值放大及距离/方位剖面。帮助理解二维脉冲响应，供板级结果核对峰位和形状；不是额外的硬件性能测试。",
    sarInjectionKind:"合成输入 · 故障注入个例",
    sarInjectionTitle:"图像相似，不等于逐位一致。",
    sarInjectionBody:"同一实验中的黄金输出、注入后输出与差值可视化。图像看起来接近时，差值仍可能存在；这只是一个个例，完整样本与判定规则见 SAR 数据手册。",
    sarFullImage:"查看原图 ↗",
    sarFigureSource:"来源（需仓库权限）↗",
    sarScope:"以上三图均为仓库已有的合成点目标研究图，未修改图内数据或色标；CSA 图像不用于代表 BP 平台的成像效果。",
    sarProvenance:"查看图像版本与校验摘要 ↗",
    sarAlgorithmEyebrow:"理解成像路径",
    sarAlgorithmTitle:"两种算法，同一个聚焦目标。",
    sarAlgorithmIntro:"以下是处理原理与已有研究实现的简介，不是两种算法在同一数据上的性能对比。",
    csaTitle:"Chirp Scaling · 调频变标算法",
    csaIntro:"在频域中通过相位补偿完成距离徙动校正与聚焦，适合围绕 FFT、复数乘法和外存调度组织规则的数据通路。",
    csaStep1:"方位向 FFT：将回波变换到距离-多普勒域。",
    csaStep2:"Chirp Scaling 相位补偿：调整不同距离单元的徙动。",
    csaStep3:"距离向 FFT、压缩与徙动补偿，再做距离向 IFFT。",
    csaStep4:"方位压缩与残余相位补偿，方位向 IFFT 输出复图像。",
    csaNote:"当前参考平台：2048 × 2048 定点 CSA。成像参数、定点位宽与处理几何需要联合验证；不是任意任务参数的即插即用承诺。",
    csaDatasheet:"CSA / SAR 数据手册 ↗",
    csaDiscuss:"讨论 CSA 方案 →",
    bpAlgorithmTitle:"Back-projection · 反投影算法",
    bpAlgorithmIntro:"对每个成像像素按平台轨迹计算斜距，从距离压缩后的回波中取样并补偿相位，再沿合成孔径相干累加。",
    bpStep1:"距离压缩：形成各个脉冲的距离向响应。",
    bpStep2:"像素与脉冲配对：由轨迹和像素位置计算斜距。",
    bpStep3:"插值与相位补偿：提取对应距离单元的复数贡献。",
    bpStep4:"沿孔径相干累加：输出每个像素的聚焦结果。",
    bpAlgorithmNote:"适合需要显式处理像素几何的研究，但计算量与访存量需评估。当前 BP 平台另有无保护、三模冗余和运行时检查变体；这些是可靠性配置，不是不同成像分辨率。",
    bpDatasheet:"BP 数据手册 ↗",
    bpDiscuss:"讨论 BP 方案 →",
    sarMethods:"算法依据（需仓库访问权限）：",
    sarBoardAlt:"合成九点目标的 FPGA 定点成像：完整场景与中心目标局部放大",
    sarFocusAlt:"CSA 单点目标参考图：全场景、峰值局部放大以及距离和方位剖面",
    sarInjectionAlt:"一次点目标故障注入的黄金图、注入后图和对数差值图",
    skip:"跳至正文",navLabel:"主导航",navProducts:"产品与方案",navCapabilities:"技术能力",navResearch:"研究笔记 ↗",navContact:"聊聊你的项目 ↗",
    heroEyebrow:"独立研发 · FPGA 信号处理平台",heroTitle:"让信号处理，<br>走出实验室。<span>走向更远处。</span>",heroDescription:"从 SAR 成像到容错计算，将算法、板卡与验证工具连接起来。为你的下一次星载或机载实验，构建扎实的起点。",
    explore:"探索产品方案 ↗",discuss:"讨论定制需求 →",heroNote:"板卡 × 算法 × 验证<br><strong>不止硬件，更是完整的实验路径。</strong>",boardAlt:"FPGA 信号处理板卡概念示意图，非实际产品照片",visualTitle:"让算法拥有硬件的力量",schematic:"板卡概念示意 · 非实物图",
    productsEyebrow:"01 / 产品与方案",productsTitle:"为你的实验，找到合适的起点。",productsIntro:"基于已有研究平台的方案展示。<br>配置、交付范围与报价，按项目需求确认。",filterLabel:"筛选方案",filterAll:n=>"全部方案 <span>"+String(n).padStart(2,"0")+"</span>",filterBoard:"板卡平台",filterIP:"算法与 IP",
    catalogNote:"面向科研与工程评估；上星或装机前的环境适应性、接口及可靠性验证需按任务要求另行确认。",
    capEyebrow:"03 / 从代码，到可信的结果",capTitle:"好算法，需要扎实的工程。",github:"在 GitHub 了解研究 ↗",
    cap1Title:"算法与硬件协同",cap1Body:"定点建模、RTL 实现与板级数据通路协同设计，让仿真结果与硬件输出能够逐项比对。",
    cap2Title:"让可靠性可验证",cap2Body:"结合 SEM 故障注入、冗余保护与错误分类，研究故障如何传播，而不只看一次正确输出。",
    cap3Title:"完整的实验闭环",cap3Body:"从主机控制、数据传输到结果检查，围绕真实实验流程组织工具，保留可追溯的验证记录。",
    processEyebrow:"04 / 合作方式",processTitle:"从一个想法，到一次实验。",processIntro:"直接与开发者沟通。<br>先明确需求，再定义交付。",
    step1Title:"聊清任务",step1Body:"应用场景、信号规模、接口与实验目标。",step2Title:"确认方案",step2Body:"评估平台配置、算法适配与验证范围。",step3Title:"约定交付",step3Body:"书面确认报价、周期、文档与支持内容。",step4Title:"开始验证",step4Body:"按双方约定的测试用例完成集成与验收。",
    inquiryEyebrow:"05 / 开启下一次探索",inquiryTitle:"你的下一次实验，<br>从这里开始。",inquiryIntro:"告诉我你正在解决什么问题。<br>我们一起找到合适的硬件与算法路径。",inquiryNote:"按需报价，不设在线支付。<br>所有配置与交付承诺以双方确认为准。",
    nameLabel:"你的称呼 *",emailLabel:"联系邮箱 *",organizationLabel:"单位 / 团队",interestLabel:"感兴趣的方案 *",scenarioLabel:"实验场景 *",requirementsLabel:"项目需求 *",namePlaceholder:"如何称呼你",organizationPlaceholder:"学校、研究所或公司",requirementsPlaceholder:"例如：SAR 成像，需要千兆网口，计划先进行地面功能验证……",
    privacyNote:"表单不会上传或保存你的信息。将生成邮件草稿，由你在邮箱中确认发送。",compose:"生成询价邮件 ↗",draftLabel:"邮件内容（也可直接复制发送）",openEmail:"打开邮箱 →",copy:"复制内容",download:"下载询价单",footerLine:"独立研发，认真对待每一个信号。",footerResearch:"研究与笔记 ↗",closeLabel:"关闭",
    details:"查看方案 +",quote:"咨询报价 ↗",datasheet:"实验数据手册",navDatasheets:"数据手册 ↗",source:"研究来源（需仓库访问权限）↗",deliveryNote:"此处为研究实现的参考参数，不是最终交付承诺；实物配置、供货、授权、价格与星载/机载适用性需沟通确认。",count:n=>n+" 个方案",selectProduct:"请选择方案",custom:"定制 / 暂不确定",selectScenario:"请选择场景",ground:"地面验证",airborne:"机载实验评估",space:"星载实验评估",other:"其他科研用途",draftReady:"询价草稿已生成，尚未发送。请打开邮箱发送，或复制 / 下载后发送至上方邮箱。",copied:"已复制，发送至 1906233797@qq.com 即可。",copyFallback:"请手动复制已选中的邮件内容。",whitespace:"请填写有效内容，不能只输入空格。",mailTo:"发送至",mailSubject:"方案询价",mailName:"称呼",mailEmail:"联系邮箱",mailOrg:"单位 / 团队",mailProduct:"感兴趣的方案",mailScenario:"实验场景",mailRequirements:"项目需求",notProvided:"未填写"
  },
  en:{
    navSAR:"SAR imaging",
    sarEyebrow:"02 / SAR IMAGES & ALGORITHMS",
    sarTitle:"From echoes to a focused image.",
    sarIntro:"Synthetic aperture radar (SAR) uses echo delay to resolve range and platform motion to form a synthetic aperture. Coherent processing focuses the two-dimensional image.",
    sarBoardKind:"SYNTHETIC INPUT · FPGA OUTPUT",
    sarBoardTitle:"Nine targets. Two-dimensional focus.",
    sarBoardBody:"A 3 × 3 synthetic point-target reconstruction from the Kintex-7 CSA platform. The full scene and center-target zoom show target locations and focus shape. This is not a terrain image.",
    sarFocusKind:"SYNTHETIC INPUT · FLOATING-POINT REFERENCE",
    sarFocusTitle:"The main lobe. And the sidelobes.",
    sarFocusBody:"A single-point reference reconstruction, peak zoom, and range/azimuth cuts illustrate the two-dimensional impulse response. They support board-output shape and peak checks, not an additional hardware performance claim.",
    sarInjectionKind:"SYNTHETIC INPUT · ONE INJECTION CASE",
    sarInjectionTitle:"Similar images are not bit-exact images.",
    sarInjectionBody:"Golden output, post-injection output, and a difference view from one experiment. Visual similarity can hide changed values. This is one case; full sample counts and decision rules are in the SAR datasheet.",
    sarFullImage:"Open full-size image ↗",
    sarFigureSource:"Source (repository access required) ↗",
    sarScope:"All three are existing synthetic-point research figures, reproduced without changing their data or color scales. These CSA figures do not represent BP imaging results.",
    sarProvenance:"Image revisions & checksums ↗",
    sarAlgorithmEyebrow:"UNDERSTAND THE PROCESSING PATH",
    sarAlgorithmTitle:"Two algorithms. One focusing goal.",
    sarAlgorithmIntro:"An introduction to the principles and existing research implementations, not a same-data performance comparison.",
    csaTitle:"Chirp scaling algorithm (CSA)",
    csaIntro:"Frequency-domain phase compensation corrects range migration and focuses the image. The processing can be organized around Fourier transforms, complex multipliers, and external-memory passes.",
    csaStep1:"Azimuth FFT: transform echoes into the range–Doppler domain.",
    csaStep2:"Chirp-scaling phase compensation: adjust range-dependent migration.",
    csaStep3:"Range FFT, range compression and migration compensation, followed by range IFFT.",
    csaStep4:"Azimuth compression and residual-phase correction; azimuth IFFT produces the complex image.",
    csaNote:"Current reference: 2048 × 2048 fixed-point CSA. Imaging parameters, word lengths, and acquisition geometry must be validated together for each integration.",
    csaDatasheet:"CSA / SAR datasheet ↗",
    csaDiscuss:"Discuss the CSA platform →",
    bpAlgorithmTitle:"Back-projection (BP)",
    bpAlgorithmIntro:"For each image pixel, calculate slant range along the platform trajectory, sample the range-compressed echoes, compensate phase, and coherently sum contributions across the aperture.",
    bpStep1:"Range compression: form each pulse's range response.",
    bpStep2:"Pixel–pulse geometry: calculate slant range from trajectory and pixel position.",
    bpStep3:"Interpolation and phase compensation: extract the corresponding complex contribution.",
    bpStep4:"Coherent aperture summation: produce each focused image pixel.",
    bpAlgorithmNote:"Useful when explicit pixel geometry matters; compute and memory demand must be assessed. The current platform has unprotected, triple-modular-redundant and runtime-checked variants. These are reliability configurations, not different image resolutions.",
    bpDatasheet:"BP datasheet ↗",
    bpDiscuss:"Discuss the BP platform →",
    sarMethods:"Algorithm references (repository access required):",
    sarBoardAlt:"FPGA fixed-point reconstruction of nine synthetic targets, with full-scene and center-target zoom",
    sarFocusAlt:"Single-point CSA reference with full scene, peak zoom, and range and azimuth cuts",
    sarInjectionAlt:"Golden image, post-injection image, and logarithmic difference for one synthetic-target fault case",
    skip:"Skip to content",navLabel:"Main navigation",navProducts:"Solutions",navCapabilities:"Capabilities",navResearch:"Research ↗",navContact:"Let's talk ↗",
    heroEyebrow:"INDEPENDENT ENGINEERING · FPGA SYSTEMS",heroTitle:"Beyond the lab.<br>Closer to your<span>next mission.</span>",heroDescription:"From synthetic aperture radar (SAR) imaging to fault-tolerant computing. Connect algorithms, FPGA boards and verification tools to build a solid foundation for airborne and spaceborne experiments.",
    explore:"Explore solutions ↗",discuss:"Discuss your project →",heroNote:"Hardware × Algorithms × Verification<br><strong>More than a board. A path to your next experiment.</strong>",boardAlt:"Concept illustration of an FPGA processing board, not a product photograph",visualTitle:"Give your algorithms a hardware edge",schematic:"Concept illustration · not a product photo",
    productsEyebrow:"01 / PRODUCTS & SOLUTIONS",productsTitle:"Find your experiment's starting point.",productsIntro:"Solutions rooted in existing research platforms. <br>Configuration, scope and pricing are agreed per project.",filterLabel:"Filter solutions",filterAll:n=>"All solutions <span>"+String(n).padStart(2,"0")+"</span>",filterBoard:"Board platforms",filterIP:"Algorithms & IP",
    catalogNote:"For research and engineering evaluation. Environmental, interface and reliability requirements must be verified for each airborne or spaceborne mission.",
    capEyebrow:"03 / FROM CODE TO CONFIDENCE",capTitle:"Good algorithms. Solid engineering.",github:"Explore the research on GitHub ↗",
    cap1Title:"Hardware meets algorithms",cap1Body:"Fixed-point models, RTL and board-level data paths designed together, so simulation and hardware outputs can be compared.",
    cap2Title:"Reliability you can investigate",cap2Body:"SEM fault injection, redundant protection and error classification reveal how faults propagate, beyond a single correct result.",
    cap3Title:"A complete experiment loop",cap3Body:"Host control, data transfer and output checks organized around real experiments, with traceable verification records.",
    processEyebrow:"04 / WORKING TOGETHER",processTitle:"From an idea to an experiment.",processIntro:"Talk directly to the developer.<br>Understand the need. Then define the delivery.",
    step1Title:"Define the mission",step1Body:"Your application, signal size, interfaces and experiment goals.",step2Title:"Shape the solution",step2Body:"Evaluate hardware, algorithm adaptation and validation scope.",step3Title:"Agree on delivery",step3Body:"Confirm pricing, timeline, documentation and support in writing.",step4Title:"Start verifying",step4Body:"Integrate and accept against the test cases we agree on.",
    inquiryEyebrow:"05 / YOUR NEXT EXPLORATION",inquiryTitle:"Your next experiment<br>starts here.",inquiryIntro:"Tell me about the problem you're solving.<br>Let's find the right hardware and algorithm path.",inquiryNote:"Project-based quotes. No online payments.<br>Configuration and delivery are confirmed together.",
    nameLabel:"Full name *",emailLabel:"Email address *",organizationLabel:"Company / organization",interestLabel:"Product of interest *",scenarioLabel:"Application *",requirementsLabel:"Project requirements *",namePlaceholder:"Full name",organizationPlaceholder:"University, institute or company",requirementsPlaceholder:"For example: SAR imaging, Gigabit Ethernet, starting with ground-based functional verification…",
    privacyNote:"Nothing is uploaded or stored. This form creates an email draft for you to review and send from your email app.",compose:"Prepare inquiry email ↗",draftLabel:"Email draft (you can also copy and send it)",openEmail:"Open email app →",copy:"Copy text",download:"Download inquiry",footerLine:"Independent engineering. Every signal matters.",footerResearch:"Research & notes ↗",closeLabel:"Close",
    details:"View solution +",quote:"Request a quote ↗",datasheet:"Experiment datasheet",navDatasheets:"Datasheets ↗",source:"Research source (repository access required) ↗",deliveryNote:"These are reference research specifications, not a delivery commitment. Hardware, availability, licensing, pricing and mission suitability are confirmed individually.",count:n=>n+(n===1?" solution":" solutions"),selectProduct:"Choose a solution",custom:"Custom / not sure yet",selectScenario:"Choose an application",ground:"Ground verification",airborne:"Airborne evaluation",space:"Spaceborne evaluation",other:"Other research",draftReady:"Draft prepared — not sent. Open your email app, or copy / download the text and send it to the address above.",copied:"Copied. Send it to 1906233797@qq.com.",copyFallback:"Please copy the selected email text manually.",whitespace:"Please enter text, not only spaces.",mailTo:"Send to",mailSubject:"Solution inquiry",mailName:"Name",mailEmail:"Email",mailOrg:"Organization / team",mailProduct:"Solution",mailScenario:"Experiment setting",mailRequirements:"Requirements",notProvided:"Not provided"
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
  return {subject,body,text:strings.mailTo+": 1906233797@qq.com\n"+subject+"\n\n"+body,mailto:"mailto:1906233797@qq.com?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body)};
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
    return `<article class="product-card"><div class="product-art ${product.style}"><span class="art-index">${product.code}</span><img src="assets/${product.image}" alt="${escapeHtml(product.id==="fft"?p.title:t("boardAlt"))}" width="660" height="490" loading="lazy"><span class="art-type">${product.id==="fft"?"SIGNAL FLOW":t("schematic")}</span></div><div class="product-info"><p class="product-category">${p.type}</p><h3>${p.title}</h3><p class="product-subtitle">${p.subtitle}</p><p class="product-description">${p.description}</p><div class="spec-chips">${product.tags.map(tag=>`<span>${tag}</span>`).join("")}</div><div class="product-bottom"><button type="button" data-details="${product.id}" aria-label="${p.title} — ${t("details")}">${t("details")}</button><button type="button" class="quote" data-quote="${product.id}" aria-label="${p.title} — ${t("quote")}">${t("quote")}</button></div><a class="datasheet-link" href="datasheets/${product.id}.html">${t("datasheet")} ↗</a><a class="repository-link" href="${product.source}" target="_blank" rel="noopener noreferrer">${t("source")}</a></div></article>`;
  }).join("");
  $("#product-count").textContent=t("count")(visible.length);
}
function renderOptions(){
  const interest=$("#interest"),scenario=$("#scenario"),oldProduct=interest.value,oldScenario=scenario.value;
  interest.innerHTML=`<option value="">${t("selectProduct")}</option>`+products.map(product=>`<option value="${product.id}">${(product[language].optionTitle||product[language].title)}</option>`).join("")+`<option value="custom">${t("custom")}</option>`;
  scenario.innerHTML=`<option value="">${t("selectScenario")}</option>`+["ground","airborne","space","other"].map(value=>`<option value="${value}">${t(value)}</option>`).join("");
  interest.value=oldProduct; scenario.value=oldScenario;
}
function renderDialog(product){
  const p=product[language];
  $("#dialog-content").innerHTML=`<p class="dialog-eyebrow">${product.code}</p><h2 id="dialog-title">${p.title}</h2><p>${p.detail}</p><dl>${p.specs.map(([key,value])=>`<div><dt>${key}</dt><dd>${value}</dd></div>`).join("")}</dl><a class="source-link" href="${product.source}" target="_blank" rel="noopener noreferrer">${t("source")}</a><a class="source-link datasheet-source" href="datasheets/${product.id}.html">${t("datasheet")} ↗</a><p class="dialog-note">${t("deliveryNote")}</p><button class="button" type="button" data-quote="${product.id}">${t("quote")}</button>`;
}
function chooseProduct(id){
  $("#interest").value=id;
  if($("#product-dialog").open){
    lastDialogTrigger=null;
    $("#product-dialog").close();
  }
  clearDraft();
  $("#inquiry").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
  $("#interest").focus({preventScroll:true});
}
function setLanguage(){
  document.documentElement.lang=language==="zh"?"zh-CN":"en";
  document.title=language==="zh"?"juwade · 信号处理，从算法到实验":"juwade · FPGA signal processing, from algorithm to experiment";
  document.querySelector('meta[name="description"]').content=language==="zh"?"juwade · 面向星载与机载实验评估的 FPGA 信号处理方案。SAR 成像、容错 FFT 与硬件在环验证。":"FPGA signal processing solutions for airborne and spaceborne research evaluation. SAR imaging, fault-tolerant FFT and hardware-in-the-loop verification.";
  document.querySelectorAll("[data-i18n]").forEach(element=>{const value=t(element.dataset.i18n);element.innerHTML=typeof value==="function"?value(products.length):value;});
  document.querySelectorAll("[data-placeholder]").forEach(element=>element.placeholder=t(element.dataset.placeholder));
  document.querySelectorAll("[data-label]").forEach(element=>element.setAttribute("aria-label",t(element.dataset.label)));
  document.querySelectorAll("[data-alt]").forEach(element=>element.alt=t(element.dataset.alt));
  document.querySelectorAll('a[href^="research.html"]').forEach(link=>link.setAttribute("href","research.html?lang="+language)); $("#language").textContent=language==="zh"?"EN ⌄":"中文 ⌄";
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
