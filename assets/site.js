"use strict";

// All catalog claims refer to the linked research implementations, not flight qualification.
const products = catalogData.products;

const translations = {
  zh:{
    utilityIntro:"FPGA 板卡 · 信号处理算法 · 实验验证",
    utilityContact:"技术咨询",
    heroSpecImage:"研究实现 · 成像规模",
    heroSpecAlgorithms:"成像算法",
    heroSpecReliability:"可靠性研究",
    heroSceneCredit:"背景：旧金山湾 SAR · NASA/JPL · 公开应用示例，非本板卡输出",
    heroSceneAlt:"NASA/JPL SIR-C/X-SAR 观测的旧金山湾伪彩色雷达影像",
    portalProducts:"产品中心",
    portalProductsNote:"板卡平台与算法 IP",
    portalSAR:"SAR 应用",
    portalSARNote:"实景影像与成像原理",
    portalDocs:"资料下载",
    portalDocsNote:"数据手册与实验统计",
    portalContact:"方案咨询",
    portalContactNote:"从需求到集成验证",
    sceneSFTitle:"旧金山湾 · 城市与海岸",
    sceneSFBody:"SIR-C/X-SAR 于 1994 年 10 月 3 日获取的影像。平静水面较暗，城市与地形结构呈现不同雷达散射特征。",
    sceneSFAlt:"旧金山湾实景 SAR 影像，城市纹理环绕深色海湾与桥梁",
    sceneAmazonTitle:"亚马孙 · 河流与湿地",
    sceneAmazonBody:"巴西马瑙斯地区的 L 波段极化合成影像。不同极化通道组合为伪彩色，展示河流、森林及淹水植被；不是自然光学颜色。",
    sceneAmazonAlt:"马瑙斯地区 L 波段 SAR 伪彩色图，蓝色河流穿过森林与湿地",
    sceneValleyTitle:"死亡谷 · 山地与冲积扇",
    sceneValleyBody:"L、C 波段通道合成的伪彩色雷达影像。粗糙山地、冲积扇与平滑盆地形成不同的后向散射纹理。",
    sceneValleyAlt:"死亡谷实景 SAR 伪彩色图，周围山脊与中间较暗的盆地清晰可辨",
    sceneKind:"公开实景 SAR · 非板卡实测",
    sceneView:"查看完整图像 ↗",
    sceneSource:"NASA/JPL 来源 ↗",
    sceneScope:"影像仅作 SAR 应用与原理示例，不代表本板卡处理结果、同源算法对比或性能指标；缩略图裁切展示，完整图像保留原幅面。",
    scenePolicy:"图像使用政策 ↗",
    sceneProvenance:"署名与文件校验 ↗",
    sceneEndorsement:"图片署名不代表 NASA、JPL 或 Caltech 对本产品背书。",
    pointValidation:"板级研究验证：查看点目标、聚焦剖面与故障对比",
    resourceEyebrow:"DOWNLOAD CENTER / 资料下载",
    resourceTitle:"技术选型，从可核对的资料开始。",
    resourceIntro:"在线阅读、离线保存或核对汇总统计。<br>每份手册说明实验范围与来源。",
    resourceSAR:"SAR / CSA 实验数据手册",
    resourceSARNote:"成像参考配置、SEU 注入统计与判定规则。",
    resourceBP:"BP 成像与可靠性手册",
    resourceBPNote:"Base-BP、TMR-BP 与 RA-BP 的实验汇总。",
    resourceFFT:"容错 FFT 参考手册",
    resourceFFTNote:"架构与集成参考；尚未收录数值实验结果。",
    readDatasheet:"阅读 / 下载手册 ↗",
    downloadEvidence:"下载统计 JSON ↓",
    footerProducts:"产品与方案",
    footerResources:"技术资源",
    footerContact:"联系开发者",
    footerBrand:"FPGA 信号处理与可靠计算",
    footerMailNote:"配置、报价与交付范围按项目沟通确认。",
    footerBottom:"公开影像用于原理展示；产品适用性与交付以双方书面确认为准。",
    navSAR:"SAR 成像",
    sarEyebrow:"SAR APPLICATIONS / SAR 应用",
    sarTitle:"看见城市、河流与大地。",
    sarIntro:"SAR 不只是点目标。真实地物影像呈现城市结构、河流湿地与山地纹理，帮助理解微波散射与二维聚焦。",
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
    skip:"跳至正文",navLabel:"主导航",navProducts:"产品中心",navCapabilities:"技术与研发",navResearch:"研究笔记 ↗",navContact:"技术咨询",
    heroEyebrow:"FPGA SIGNAL PROCESSING SOLUTIONS",heroTitle:"FPGA 信号处理<br><span>从算法，到系统。</span>",heroDescription:"聚焦 SAR 成像与可靠计算，为科研团队连接算法、FPGA 板卡和验证工具。面向机载与星载实验评估，按任务定义适配方案。",
    explore:"进入产品中心 →",discuss:"探索 SAR 应用 →",heroNote:"板卡 × 算法 × 验证<br><strong>不止硬件，更是完整的实验路径。</strong>",boardAlt:"FPGA 信号处理板卡概念示意图，非实际产品照片",visualTitle:"让算法拥有硬件的力量",schematic:"板卡概念示意 · 非实物图",
    productsEyebrow:"PRODUCT CENTER / 产品中心",productsTitle:"面向信号处理的硬件与算法",productsIntro:"从研究平台出发，围绕任务选型。<br>板卡配置、算法授权与交付范围逐项确认。",filterLabel:"筛选方案",filterAll:n=>"全部方案 <span>"+String(n).padStart(2,"0")+"</span>",filterBoard:"板卡平台",filterIP:"算法与 IP",
    catalogNote:"面向科研与工程评估；上星或装机前的环境适应性、接口及可靠性验证需按任务要求另行确认。",
    capEyebrow:"ENGINEERING / 技术与研发",capTitle:"从数据通路，到验证闭环。",github:"在 GitHub 了解研究 ↗",
    cap1Title:"算法与硬件协同",cap1Body:"定点建模、RTL 实现与板级数据通路协同设计，让仿真结果与硬件输出能够逐项比对。",
    cap2Title:"让可靠性可验证",cap2Body:"结合 SEM 故障注入、冗余保护与错误分类，研究故障如何传播，而不只看一次正确输出。",
    cap3Title:"完整的实验闭环",cap3Body:"从主机控制、数据传输到结果检查，围绕真实实验流程组织工具，保留可追溯的验证记录。",
    processEyebrow:"04 / 合作方式",processTitle:"从一个想法，到一次实验。",processIntro:"直接与开发者沟通。<br>先明确需求，再定义交付。",
    step1Title:"聊清任务",step1Body:"应用场景、信号规模、接口与实验目标。",step2Title:"确认方案",step2Body:"评估平台配置、算法适配与验证范围。",step3Title:"约定交付",step3Body:"书面确认报价、周期、文档与支持内容。",step4Title:"开始验证",step4Body:"按双方约定的测试用例完成集成与验收。",
    inquiryEyebrow:"05 / 开启下一次探索",inquiryTitle:"你的下一次实验，<br>从这里开始。",inquiryIntro:"告诉我你正在解决什么问题。<br>我们一起找到合适的硬件与算法路径。",inquiryNote:"按需报价，不设在线支付。<br>所有配置与交付承诺以双方确认为准。",
    nameLabel:"你的称呼 *",emailLabel:"联系邮箱 *",organizationLabel:"单位 / 团队",interestLabel:"感兴趣的方案 *",scenarioLabel:"实验场景 *",requirementsLabel:"项目需求 *",namePlaceholder:"如何称呼你",organizationPlaceholder:"学校、研究所或公司",requirementsPlaceholder:"例如：SAR 成像，需要千兆网口，计划先进行地面功能验证……",
    privacyNote:"表单不会上传或保存你的信息。将生成邮件草稿，由你在邮箱中确认发送。",compose:"生成询价邮件 ↗",draftLabel:"邮件内容（也可直接复制发送）",openEmail:"打开邮箱 →",copy:"复制内容",download:"下载询价单",footerLine:"独立研发 · 板卡与算法协同 · 面向实验评估",footerResearch:"研究与笔记 ↗",closeLabel:"关闭",
    details:"查看方案 +",quote:"咨询报价 ↗",datasheet:"实验数据手册",navDatasheets:"资料下载",source:"研究来源（需仓库访问权限）↗",deliveryNote:"此处为研究实现的参考参数，不是最终交付承诺；实物配置、供货、授权、价格与星载/机载适用性需沟通确认。",count:n=>n+" 个方案",selectProduct:"请选择方案",custom:"定制 / 暂不确定",selectScenario:"请选择场景",ground:"地面验证",airborne:"机载实验评估",space:"星载实验评估",other:"其他科研用途",draftReady:"询价草稿已生成，尚未发送。请打开邮箱发送，或复制 / 下载后发送至上方邮箱。",copied:"已复制，发送至 1906233797@qq.com 即可。",copyFallback:"请手动复制已选中的邮件内容。",whitespace:"请填写有效内容，不能只输入空格。",mailTo:"发送至",mailSubject:"方案询价",mailName:"称呼",mailEmail:"联系邮箱",mailOrg:"单位 / 团队",mailProduct:"感兴趣的方案",mailScenario:"实验场景",mailRequirements:"项目需求",notProvided:"未填写"
  },
  en:{
    utilityIntro:"FPGA boards · Signal processing · Experiment verification",
    utilityContact:"Technical enquiries",
    heroSpecImage:"Research image size",
    heroSpecAlgorithms:"Imaging algorithms",
    heroSpecReliability:"Reliability research",
    heroSceneCredit:"Background: San Francisco Bay SAR · NASA/JPL · Application illustration, not our board output",
    heroSceneAlt:"NASA/JPL SIR-C/X-SAR false-color radar image of San Francisco Bay",
    portalProducts:"Products",
    portalProductsNote:"FPGA platforms & algorithm IP",
    portalSAR:"SAR applications",
    portalSARNote:"Real scenes & imaging principles",
    portalDocs:"Downloads",
    portalDocsNote:"Datasheets & experiment evidence",
    portalContact:"Talk to an engineer",
    portalContactNote:"Requirements through verification",
    sceneSFTitle:"San Francisco Bay · City & coast",
    sceneSFBody:"Acquired by SIR-C/X-SAR on October 3, 1994. Calm water appears dark, while urban and terrain structures exhibit different radar-scattering patterns.",
    sceneSFAlt:"Real SAR image of San Francisco Bay, with urban texture around dark water and bridges",
    sceneAmazonTitle:"Amazon · Rivers & wetlands",
    sceneAmazonBody:"L-band polarimetric composite of the Manaus region, Brazil. Polarization channels form false colors that reveal rivers, forest and flooded vegetation, not natural optical colors.",
    sceneAmazonAlt:"L-band false-color SAR image of Manaus with blue rivers through forest and wetlands",
    sceneValleyTitle:"Death Valley · Mountains & fans",
    sceneValleyBody:"False-color L- and C-band radar composite. Rough mountains, alluvial fans and smoother basins produce contrasting backscatter textures.",
    sceneValleyAlt:"Real false-color SAR image of Death Valley with bright ridges around a darker basin",
    sceneKind:"PUBLIC SAR SCENE · NOT OUR BOARD OUTPUT",
    sceneView:"View complete image ↗",
    sceneSource:"NASA/JPL source ↗",
    sceneScope:"These scenes illustrate SAR applications and principles only: they are not our board outputs, algorithm comparisons or performance measurements. Thumbnails are cropped; complete images preserve the full frame.",
    scenePolicy:"Image-use policy ↗",
    sceneProvenance:"Credits & checksums ↗",
    sceneEndorsement:"Image credits do not imply endorsement by NASA, JPL or Caltech.",
    pointValidation:"Board research validation: point targets, focus profiles & fault comparison",
    resourceEyebrow:"DOWNLOAD CENTER",
    resourceTitle:"Start with evidence you can inspect.",
    resourceIntro:"Read online, save offline or inspect the aggregates.<br>Each sheet explains its experimental scope and sources.",
    resourceSAR:"SAR / CSA experiment datasheet",
    resourceSARNote:"Reference configuration, SEU injection counts and decision rules.",
    resourceBP:"BP imaging & reliability datasheet",
    resourceBPNote:"Experiment summaries for Base-BP, TMR-BP and RA-BP.",
    resourceFFT:"Fault-tolerant FFT reference",
    resourceFFTNote:"Architecture and integration reference; no numeric campaign results published.",
    readDatasheet:"Read / download datasheet ↗",
    downloadEvidence:"Download evidence JSON ↓",
    footerProducts:"Products & solutions",
    footerResources:"Technical resources",
    footerContact:"Contact the developer",
    footerBrand:"FPGA signal processing & reliable computing",
    footerMailNote:"Discuss configuration, pricing and delivery scope for your project.",
    footerBottom:"Public imagery illustrates principles; product suitability and delivery follow the written project agreement.",
    navSAR:"SAR imaging",
    sarEyebrow:"SAR APPLICATIONS",
    sarTitle:"Cities. Rivers. A different view of Earth.",
    sarIntro:"SAR is more than point targets. Real-world scenes reveal urban structure, river wetlands and mountain texture, illustrating microwave scattering and two-dimensional focusing.",
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
    skip:"Skip to content",navLabel:"Main navigation",navProducts:"Products",navCapabilities:"Engineering",navResearch:"Research ↗",navContact:"Contact us",
    heroEyebrow:"FPGA SIGNAL PROCESSING SOLUTIONS",heroTitle:"Signal processing.<br><span>Built into systems.</span>",heroDescription:"Connect SAR imaging algorithms, FPGA platforms and verification tools. Scope hardware and integration for airborne and spaceborne research evaluation.",
    explore:"Explore products →",discuss:"Explore SAR applications →",heroNote:"Hardware × Algorithms × Verification<br><strong>More than a board. A path to your next experiment.</strong>",boardAlt:"Concept illustration of an FPGA processing board, not a product photograph",visualTitle:"Give your algorithms a hardware edge",schematic:"Concept illustration · not a product photo",
    productsEyebrow:"PRODUCT CENTER",productsTitle:"Hardware and algorithms for signal processing",productsIntro:"Choose a starting point from existing research.<br>Configuration, licensing and delivery are agreed per project.",filterLabel:"Filter solutions",filterAll:n=>"All solutions <span>"+String(n).padStart(2,"0")+"</span>",filterBoard:"Board platforms",filterIP:"Algorithms & IP",
    catalogNote:"For research and engineering evaluation. Environmental, interface and reliability requirements must be verified for each airborne or spaceborne mission.",
    capEyebrow:"ENGINEERING",capTitle:"A data path. A verification loop.",github:"Explore the research on GitHub ↗",
    cap1Title:"Hardware meets algorithms",cap1Body:"Fixed-point models, RTL and board-level data paths designed together, so simulation and hardware outputs can be compared.",
    cap2Title:"Reliability you can investigate",cap2Body:"SEM fault injection, redundant protection and error classification reveal how faults propagate, beyond a single correct result.",
    cap3Title:"A complete experiment loop",cap3Body:"Host control, data transfer and output checks organized around real experiments, with traceable verification records.",
    processEyebrow:"04 / WORKING TOGETHER",processTitle:"From an idea to an experiment.",processIntro:"Talk directly to the developer.<br>Understand the need. Then define the delivery.",
    step1Title:"Define the mission",step1Body:"Your application, signal size, interfaces and experiment goals.",step2Title:"Shape the solution",step2Body:"Evaluate hardware, algorithm adaptation and validation scope.",step3Title:"Agree on delivery",step3Body:"Confirm pricing, timeline, documentation and support in writing.",step4Title:"Start verifying",step4Body:"Integrate and accept against the test cases we agree on.",
    inquiryEyebrow:"05 / YOUR NEXT EXPLORATION",inquiryTitle:"Your next experiment<br>starts here.",inquiryIntro:"Tell me about the problem you're solving.<br>Let's find the right hardware and algorithm path.",inquiryNote:"Project-based quotes. No online payments.<br>Configuration and delivery are confirmed together.",
    nameLabel:"Full name *",emailLabel:"Email address *",organizationLabel:"Company / organization",interestLabel:"Product of interest *",scenarioLabel:"Application *",requirementsLabel:"Project requirements *",namePlaceholder:"Full name",organizationPlaceholder:"University, institute or company",requirementsPlaceholder:"For example: SAR imaging, Gigabit Ethernet, starting with ground-based functional verification…",
    privacyNote:"Nothing is uploaded or stored. This form creates an email draft for you to review and send from your email app.",compose:"Prepare inquiry email ↗",draftLabel:"Email draft (you can also copy and send it)",openEmail:"Open email app →",copy:"Copy text",download:"Download inquiry",footerLine:"Independent engineering · Hardware & algorithms · Research evaluation",footerResearch:"Research & notes ↗",closeLabel:"Close",
    details:"View solution +",quote:"Request a quote ↗",datasheet:"Experiment datasheet",navDatasheets:"Downloads",source:"Research source (repository access required) ↗",deliveryNote:"These are reference research specifications, not a delivery commitment. Hardware, availability, licensing, pricing and mission suitability are confirmed individually.",count:n=>n+(n===1?" solution":" solutions"),selectProduct:"Choose a solution",custom:"Custom / not sure yet",selectScenario:"Choose an application",ground:"Ground verification",airborne:"Airborne evaluation",space:"Spaceborne evaluation",other:"Other research",draftReady:"Draft prepared — not sent. Open your email app, or copy / download the text and send it to the address above.",copied:"Copied. Send it to 1906233797@qq.com.",copyFallback:"Please copy the selected email text manually.",whitespace:"Please enter text, not only spaces.",mailTo:"Send to",mailSubject:"Solution inquiry",mailName:"Name",mailEmail:"Email",mailOrg:"Organization / team",mailProduct:"Solution",mailScenario:"Experiment setting",mailRequirements:"Requirements",notProvided:"Not provided"
  }
};

Object.assign(translations.zh,solutionTranslations.zh);
Object.assign(translations.en,solutionTranslations.en);
translations.zh.count=n=>n+" 款板卡";
translations.en.count=n=>n+" board"+(n===1?"":"s");

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

function renderOptions(){
  const interest=$("#interest"),scenario=$("#scenario"),oldProduct=interest.value,oldScenario=scenario.value;
  interest.innerHTML=`<option value="">${t("selectProduct")}</option>`+products.map(product=>`<option value="${product.id}">${(product[language].optionTitle||product[language].title)}</option>`).join("")+`<option value="custom">${t("custom")}</option>`;
  scenario.innerHTML=`<option value="">${t("selectScenario")}</option>`+["ground","airborne","space","other"].map(value=>`<option value="${value}">${t(value)}</option>`).join("");
  interest.value=oldProduct; scenario.value=oldScenario;
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
  document.title=language==="zh"?"juwade · 抗辐射星载 SAR 设计方案":"juwade · Radiation-tolerant spaceborne SAR design";
  document.querySelector('meta[name="description"]').content=language==="zh"?"抗辐射星载 SAR 设计方案：A7、K7、V7 板卡，CSA / BP 成像算法，FFT / CORDIC 基本算子与辐射效应仿真。":"Radiation-tolerant spaceborne SAR design: A7, K7 and V7 hardware, CSA/BP algorithms, FFT/CORDIC primitives and radiation-effects simulation.";
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
