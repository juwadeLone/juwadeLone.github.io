"""Build bilingual, printable datasheets from versioned experiment evidence.

Usage: python3 scripts/build_datasheets.py --sar-repo ../2048-2048cs-k7-sem
       --bp-repo ../BP-FT-platform --fft-repo ../fault-tolerant-SDF-FFT-designs
No measurements are inferred from RTL or copied from manuscript claims.
"""
import argparse
import collections
import hashlib
import html
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "datasheets"
ARMS = ["pilot", "e0", "control", "e2_pre", "e2_post", "e1_rest"]
CSS = """
:root{font-family:"Segoe UI","Noto Sans CJK SC","Microsoft YaHei",sans-serif;color:#172e32;background:#f8f9f6;font-size:14px;line-height:1.7}
*{box-sizing:border-box}body{margin:0}main{max-width:1050px;margin:auto;padding:36px 36px 70px}a{color:#327079;text-underline-offset:3px}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #dce2de;padding-bottom:20px;gap:20px}header a{font-size:13px}nav{display:flex;gap:18px;flex-wrap:wrap;margin:25px 0}h1{font-size:34px;line-height:1.4;letter-spacing:-1px;margin:28px 0 5px}h2{font-size:21px;margin:35px 0 15px}h3{font-size:16px}p{margin:10px 0}small,.muted{color:#667273;font-size:12px}.eyebrow{font:11px monospace;letter-spacing:2px;color:#327079}.notice{border-left:3px solid #327079;background:#eaf0e8;padding:15px 20px;margin:25px 0}.table-wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:12px;margin:12px 0 20px;font-variant-numeric:tabular-nums}th,td{border-bottom:1px solid #dce2de;text-align:right;padding:10px 9px;vertical-align:top}th{background:#eaf0e8;font-weight:600}th:first-child,td:first-child{text-align:left}td{white-space:nowrap}td:first-child{white-space:normal}button,.download{display:inline-block;background:#163c41;color:white;border:0;border-radius:5px;padding:11px 16px;font:inherit;font-size:12px;cursor:pointer;text-decoration:none}.actions{display:flex;gap:12px;flex-wrap:wrap;margin:25px 0}.sources{overflow-wrap:anywhere;font-size:12px}.sources li{margin-bottom:15px}.source-hash{display:block;font:10px monospace;color:#667273}.stat{border:1px solid #dce2de;border-radius:8px;padding:17px;background:white;margin:16px 0}footer{margin-top:40px;border-top:1px solid #dce2de;padding-top:18px;font-size:11px;color:#667273}code{font-size:12px;overflow-wrap:anywhere}ul{padding-left:22px}a:focus-visible,button:focus-visible{outline:3px solid #327079;outline-offset:4px}
@media(max-width:600px){main{padding:22px 20px 40px}h1{font-size:27px}header{align-items:start}header strong{max-width:140px}.table-wrap{margin-right:-20px;padding-right:20px}th,td{padding:8px}nav{gap:12px;font-size:12px}}
@media print{@page{size:A4;margin:15mm}html,body{background:white}main{max-width:none;padding:0;font-size:10px}.actions,header,nav{display:none}h1{font-size:24px}h2{font-size:16px;break-after:avoid}h3{break-after:avoid}table{font-size:9px}tr{break-inside:avoid}thead{display:table-header-group}a{color:inherit}.table-wrap{overflow:visible}th,td{white-space:normal;padding:6px 5px}.notice{font-size:10px}.sources li{break-inside:avoid}.source-hash{font-size:8px}.sources{font-size:9px}footer{font-size:9px}}
"""


def read(repo, relative, evidence, repo_name, sha):
    # Read exactly the bytes that the pinned source link resolves to, even if
    # the source checkout has staged or unstaged experimental edits.
    content = subprocess.check_output(["git", "-C", str(repo), "show", f"{sha}:{relative}"])
    evidence.append({"path": relative, "commit": sha,
                     "sha256": hashlib.sha256(content).hexdigest(),
                     "url": f"https://github.com/juwadeLone/{repo_name}/blob/{sha}/{relative}"})
    return content


def commit(repo):
    return subprocess.check_output(["git", "-C", str(repo), "rev-parse", "HEAD"], text=True).strip()


def table(headers, rows):
    esc = lambda value: html.escape(str(value))
    return '<div class="table-wrap"><table><thead><tr>' + "".join(f"<th scope='col'>{esc(h)}</th>" for h in headers) + "</tr></thead><tbody>" + "".join("<tr>" + "".join(f"<td>{esc(v)}</td>" for v in row) + "</tr>" for row in rows) + "</tbody></table></div>"


def page(key, title, subtitle, content, data):
    data["source_access"] = "Repository access may be required; commit links are not guaranteed publicly accessible. This JSON contains aggregate results and source digests, not original experimental logs."
    sources = "".join(f'<li><a href="{item["url"]}" target="_blank" rel="noopener noreferrer">{html.escape(item["path"])}</a><span class="source-hash">Commit: {item["commit"]}<br>SHA-256: {item["sha256"]}</span></li>' for item in data["sources"])
    body = f"""<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} | juwade datasheet</title><style>{CSS}</style></head><body><main>
<header><strong>juwade. / SIGNAL SYSTEMS</strong><a href="../index.html#products">返回产品 / Back to solutions ↗</a></header>
<nav aria-label="数据手册 / Datasheets"><a href="sar.html">SAR / CSA</a><a href="bp.html">BP / Reliability</a><a href="fft.html">FFT / IP</a></nav>
<p class="eyebrow">RESEARCH DATASHEET / REV 1.0 / {key.upper()}</p><h1>{title}</h1><p class="muted">{subtitle}</p>
<div class="actions"><button onclick="window.print()">打印 / 保存 PDF · Print / save PDF</button><a class="download" href="{key}.html" download="juwade-{key}-datasheet.html">下载手册 HTML / Offline copy</a><a href="{key}.json" download="juwade-{key}-evidence.json">下载数据 / Evidence JSON</a></div>
<div class="notice"><strong>研究实测 ≠ 飞行鉴定 / Research evidence ≠ flight qualification</strong><p>以下为指定版本与实验条件下的故障注入结果，不是辐照试验、在轨数据或最终商业产品的性能保证。不能直接推算空间 SEU 率或任务失效率。<br>Results apply only to the cited builds and conditions. They are not irradiation tests, in-orbit measurements, mission failure rates or a product guarantee.</p></div>
{content}
<h2>可追溯来源 / Traceable evidence</h2><p class="muted">统计由仓库文件生成；链接固定到提交，SHA-256 用于核对原始文件。 Counts are generated from repository evidence; links are commit-pinned and original file digests are provided.</p><div class="notice"><strong>原始来源需仓库权限 / Source repository access required</strong><p>以下链接供具备对应仓库访问权限的读者核对版本；未登录或未获授权时可能显示 404，不能保证公开访问。可下载的汇总 JSON 含计数与文件摘要，不包含原始实验日志。如需审阅原始记录，请通过产品页联系作者。<br>These source links are for readers with access to the corresponding repositories and may return 404 when signed out or unauthorized. The downloadable JSON contains aggregate counts and digests, not raw experiment logs. Contact the author through the product page to request evidence access.</p></div><ol class="sources">{sources}</ol>
<h2>复核方法 / Reproduction</h2><p>在网站仓库运行 <code>python3 scripts/build_datasheets.py --help</code>，指定三个来源仓库路径，可重新生成本页与 JSON。<br>Regenerate this page and its evidence JSON using the versioned Python script and the source checkouts.</p>
<footer>juwade · 独立研发 / Independent engineering · 参考配置、价格、供货、授权与任务适用性按项目另行确认。 Configuration, availability, licensing and mission suitability are agreed per project.</footer></main></body></html>"""
    (OUT / f"{key}.html").write_text(body, encoding="utf-8")
    (OUT / f"{key}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def build_sar(repo):
    sha = commit(repo)
    data = {"schema": 1, "solution": "sar", "sources": [], "campaigns": {},
            "method": "Count task.outcome in each JSONL arm; absent task outcome is NO_TASK. Arms have different sampling and repeated targets; do not pool them into a device-wide probability."}
    for campaign in ["sem_campaign_pt3x3w", "sem_campaign_v2_reference"]:
        data["campaigns"][campaign] = {}
        for arm in ARMS:
            relative = f"results/k7_cram/{campaign}/{arm}/injections.jsonl"
            rows = [json.loads(line) for line in read(repo, relative, data["sources"], "2048-2048cs-k7-sem", sha).decode().splitlines() if line.strip()]
            counts = collections.Counter(row.get("task", {}).get("outcome", "NO_TASK") for row in rows)
            assert set(counts) <= {"MASKED", "SDC", "DUE", "NO_TASK"}, counts
            assert sum(counts.values()) == len(rows)
            data["campaigns"][campaign][arm] = {"records": len(rows), **{k: counts[k] for k in ["MASKED", "SDC", "DUE", "NO_TASK"]}}
    content = """<h2>平台与实验 / Platform & experiment</h2><p>Kintex-7 XC7K325T FFG900-2；2048 × 2048 定点 CSA SAR；125 MHz 参考实现；DDR3 / UDP / UART。Xilinx SEM 单比特配置存储器注入，输出 33,554,432 B 与各输入对应的 golden 逐位比较。<br>Single-bit CRAM injection via Xilinx SEM, comparing the 33,554,432-byte output bit-for-bit against the corresponding golden output.</p>
<p>参考位流 SHA-256：<code>541765718cd2bd0f5fcc3d72417f872c3452ac8c963e092d70cc1461ad9b8d82</code>。全局 essential-bit 池 20,724,619 位，抽样 seed 20260914（来源仓库采样规范）。<br>Reference bitstream digest above; essential-bit pool 20,724,619, sampling seed 20260914 per the source campaign specification.</p>"""
    read(repo, "results/k7_cram/sem_campaign_pt3x3w/pt_vs_gf3_report.md", data["sources"], "2048-2048cs-k7-sem", sha)
    read(repo, "README.md", data["sources"], "2048-2048cs-k7-sem", sha)
    for campaign, title in [("sem_campaign_pt3x3w", "点目标 / Point-target scene"), ("sem_campaign_v2_reference", "GF-3 输入 / GF-3 reference input")]:
        content += f"<h2>{title}</h2>"
        rows = []
        for arm, result in data["campaigns"][campaign].items():
            denominator = result["MASKED"] + result["SDC"]
            rows.append([arm, result["records"], result["MASKED"], result["SDC"], result["DUE"], result["NO_TASK"], f'{result["SDC"]}/{denominator} = {100*result["SDC"]/denominator:.2f}%'])
        content += table(["实验臂 / Arm", "记录 / N", "MASKED", "SDC", "DUE", "NO_TASK", "SDC / (M + SDC)"], rows)
    content += """<h2>统计口径 / Interpretation</h2><ul><li>MASKED：输出与 golden 一致；SDC：有输出但不一致；DUE：任务/传输异常；NO_TASK：没有任务结果。 DUE 与 NO_TASK 不纳入 SDC/(M+SDC) 分母。<br>MASKED matches golden; SDC differs; DUE is a task/transport failure; NO_TASK has no task outcome. DUE and NO_TASK are excluded from the displayed SDC sensitivity denominator.</li>
<li>e0 为全局均匀抽样；pilot/e1_rest 为分层抽样；control 为非 essential 对照；e2_pre/e2_post 复用 e0 前 100 个靶点，对比注入时机。不同实验臂不可当作独立同分布总体合并。<br>e0 is global-uniform; pilot/e1_rest are stratified; control uses non-essential bits; e2 arms reuse the first 100 e0 targets. Do not pool arms as independent samples.</li>
<li>点目标各臂共 2,051 条，NO_TASK 共 5；GF-3 共 2,051 条，NO_TASK 共 3。原报告的 M/SDC/DUE 表未单列所有缺失任务，本手册显式列出。<br>Missing task outcomes are explicitly retained here, unlike the abbreviated report table.</li>
<li>DUE 受主机与传输节流配置影响，不能解读为纯器件辐射敏感度。输出相同也不代表任务级无风险。<br>Host and transport pacing affect DUE; these counts are not physical device radiation sensitivity.</li></ul>"""
    page("sar", "SAR / CSA 板卡实验数据手册", "Kintex-7 · SEM CRAM fault injection · Point-target & GF-3", content, data)


def build_bp(repo):
    sha = commit(repo)
    data = {"schema": 1, "solution": "bp", "sources": [], "builds": {}, "criterion": "Original W17 golden, DUE or output below the 50 dB line. Not the stricter post-processing criteria."}
    paths = {"V7": "results/20261028-bp-v7-cram/summary/summary.json",
             "T7": "experiments/bp_k7/results/t7_cram_merged_20261029/summary/summary.json",
             "P7C": "experiments/bp_k7/results/p7c_cram_merged_20261031/summary/summary.json"}
    rows,controls = [],[]
    for name, relative in paths.items():
        summary = json.loads(read(repo, relative, data["sources"], "BP_FT_platform", sha))
        batch, rate = summary["batches"]["e0_point"], summary["rates"]["below_line_or_DUE"]
        assert batch["valid"] == batch.get("identical",0)+batch.get("changed",0)+batch.get("below_line",0)+batch.get("DUE",0)
        assert rate["k"] == batch.get("below_line",0)+batch.get("DUE",0)
        data["builds"][name] = {"pool_bits": summary["pool"], "e0": batch, "failure": rate, "control": summary["batches"]["control"]}
        rows.append([name, batch["valid"], batch["identical"], batch["changed"], batch["below_line"], batch.get("DUE",0), f'{rate["k"]}/{rate["n"]} = {100*rate["share"]:.2f}%', f'{100*rate["share_ci"][0]:.3f}–{100*rate["share_ci"][1]:.3f}%'])
        control = summary["batches"]["control"]
        controls.append([name,batch["records"]-batch["valid"],control["records"],control["valid"],control["identical"],control["invalid"]])
    read(repo, "experiments/bp_k7/results/p7c_cram_merged_20261031/p7.md", data["sources"], "BP_FT_platform", sha)
    read(repo, "experiments/bp_k7/results/v7_t7_p7c_cram_compare_20261031.md", data["sources"], "BP_FT_platform", sha)
    read(repo, "README.md", data["sources"], "BP_FT_platform", sha)
    content = """<h2>平台与判据 / Platform & criterion</h2><p>Kintex-7 XC7K325T FFG900-2，DDR3 2 GiB，UDP，Vivado 2018.3；2048 × 2048 定点 BP SAR，点目标输入。V7 = Base-BP，T7 = TMR-BP，P7C = 运行时检查 RA-BP。<br>Fixed-point BP SAR, point-target scene. V7 is the unprotected baseline; T7 is whole-application TMR; P7C is runtime-checked RA-BP.</p><p>使用原始 W17 golden / 50 dB 判定线：失效 = below_line + DUE。changed 为输出改变但在判定线上方，不计入这个“失效”分子，并非输出正确。<br>Original criterion: failure = below_line + DUE. Changed outputs above the threshold are excluded from this failure count but are not bit-exactly correct.</p>"""
    content += table(["版本 / Build","有效 / N","相同 / Same","Changed","Below line","DUE","失效 / Failure","95% Wilson CI"], rows)
    content += "<h2>抽样池与等效敏感位数 / Pool-weighted vulnerable bits</h2><p>各版本 essential-bit 池不同。下表为失效比例 × 抽样池位数，单位是 bit，不是 cm²；它不是辐照截面或空间失效率。<br>Failure fraction × essential-bit pool, in bits, not cm². This is not an irradiation cross-section or an in-orbit failure rate.</p>"
    content += table(["版本 / Build","Essential pool (bits)","等效敏感位 / Vulnerable bits","95% Wilson interval (bits)"], [[name,f'{value["pool_bits"]:,}', f'{value["failure"]["xsec"]:,.0f}', "–".join(f"{v:,.0f}" for v in value["failure"]["xsec_ci"])] for name,value in data["builds"].items()])
    content += "<h2>对照与无效记录 / Controls & exclusions</h2>"
    content += table(["版本 / Build","e0 无效 / Invalid","对照记录 / Records","对照有效 / Valid","对照相同 / Same","对照无效 / Invalid"],controls)
    content += """<div class="stat"><strong>P7C：71 次检测报警，71 次重跑恢复 / 71 detected cases, 71 recovered by rerun</strong><p>该统计仅限这 1,200 发有效样本；另有 40 发 changed、3 发 below_line 未被阻止，DUE 为 0。0/1,200 的 DUE 不等于风险为零，95% Wilson 上界约 0.319%。<br>These observations apply only to the valid sample: 40 changed and 3 below-line outputs remain; DUE was 0. Zero observed DUE is not zero risk (95% Wilson upper bound ≈ 0.319%).</p></div>
<h2>适用边界 / Limits</h2><ul><li>P7C 为两块同型号板合并的同一构建实验，1,201 条 e0 记录中排除一条无效注入；包括备用靶点补测。<br>P7C merges the same build on two boards; one invalid e0 injection is excluded and a spare target is included.</li><li>T7 与 P7C 各 3/1,200 失效，区间重叠；不能凭此样本断言两者任务可靠性孰优。<br>T7 and P7C both have 3/1,200 failures with overlapping intervals; no mission-level superiority follows.</li><li>本页不混合更严格的位移、假目标、相位等后处理判据；更换判据会改变失效数。<br>Stricter shift, false-target and phase post-processing criteria are not mixed into the original criterion.</li></ul>"""
    page("bp", "BP 板卡可靠性实验数据手册", "Kintex-7 · Base-BP / TMR-BP / RA-BP · CRAM campaign", content, data)


def build_fft(repo):
    data = {"schema": 1, "solution": "fft", "sources": [], "measurement_status": "No published numeric SEU campaign results found in the cited repository; no performance or recovery-rate claim."}
    sha = commit(repo)
    for relative in ["README.md","uart_fi/README.md"]:
        read(repo,relative,data["sources"],"fault_tolerant_SDF_FFT_designs",sha)
    content = """<h2>参考设计 / Reference design</h2>"""
    content += table(["项目 / Item","配置 / Configuration"],[["FFT","1024-point / 4-lane / 10-stage parallel SDF"],["RTL","SystemVerilog; SubFFT S0–S3, PFFT P0–P2"],["参考器件 / Device","XC7VX690T FFG1761-2"],["工具 / Tools","Vivado 2022.1"],["注入点 / Injection","Feedback-memory read port / butterfly output"],["控制 / Control","UART ARM/FIRE; single-cycle, one-bit flip"]])
    content += """<div class="notice"><strong>数值实测结果暂未收录 / Numeric measurements not yet included</strong><p>引用仓库提供 RTL、注入控制与配置说明，未发现可直接追溯的 SEU 战役计数/统计表。因此本页不编造纠错率、吞吐、资源占用或飞行适用性数据。<br>The cited source contains RTL, injection controls and configuration guidance, but no traceable numeric SEU campaign table was found. Recovery rates, throughput, resource figures and flight suitability are not asserted.</p></div><h2>阈值与复现 / Thresholds & reproduction</h2><p>源代码默认阈值：S3=4、P1=8、S1=16；仓库说明稿件实验采用 S3=2、P1=3、S1=5（原始 syndrome LSB 单位）。复现需显式记录覆盖值，不能将不同阈值混为同一结果。<br>RTL defaults are S3=4, P1=8, S1=16. The README states manuscript calibration uses S3=2, P1=3, S1=5 in raw-syndrome LSB units. Record overrides explicitly before comparing experiments.</p><p>该方案为算法/IP，不是独立板卡。UART 内部数据通路翻转也不等同于 SAR/BP 的 SEM CRAM 注入，两类数据不可合并。<br>This is an algorithm/IP solution, not a standalone board. UART datapath flips and SEM CRAM injection are different fault models and must not be pooled.</p>"""
    page("fft","容错 FFT 技术数据手册","Parallel streaming FFT · Reference design & evidence status",content,data)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sar-repo",type=Path,default=ROOT.parent/"2048-2048cs-k7-sem")
    parser.add_argument("--bp-repo",type=Path,default=ROOT.parent/"BP-FT-platform")
    parser.add_argument("--fft-repo",type=Path,default=ROOT.parent/"fault-tolerant-SDF-FFT-designs")
    args=parser.parse_args()
    OUT.mkdir(exist_ok=True)
    build_sar(args.sar_repo)
    build_bp(args.bp_repo)
    build_fft(args.fft_repo)
    print("Generated 3 bilingual HTML datasheets and 3 evidence JSON files.")
