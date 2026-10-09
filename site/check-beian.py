#!/usr/bin/env python3
"""备案硬闸：检查 dist/ 里每个页面。任一页不满足，退出码 1，deploy.sh 据此中止上线。
红线（来自备案要求）：title 含备案名；页脚有工信部备案号并链到 beian.miit.gov.cn；
页脚有公安备案号、链到公安备案查询、带备案图标。"""
import sys, pathlib

ICP = "冀ICP备2026030491号-1"
MPS_CODE = "13063402000302"
MPS_NO = "冀公网安备%s号" % MPS_CODE
MPS_URL = "https://beian.mps.gov.cn/#/query/webSearch?code=" + MPS_CODE
NAME = "王少怀的研究笔记"
SKIP = ("baidu_verify_", "BingSiteAuth")  # 搜索引擎验证文件，不是页面
# 豁免：整页带 noindex 的（改址跳转页 /mingjian/、本地写作台 /admin/）。
# diagrams/ 下 archify 生成的交互图已手工补备案页脚；重新生成会丢，丢了就被这道闸拦下。
EXEMPT_PREFIX = ()

dist = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "dist")
pages = [p for p in sorted(dist.rglob("*.html")) if not p.name.startswith(SKIP)]
problems = []
exempt = 0
if not pages:
    problems.append("dist 里没有任何页面")
if not (dist / "gongan-beian.png").is_file():
    problems.append("dist/gongan-beian.png 缺失（公安备案图标文件）")
for p in pages:
    h = p.read_text(encoding="utf-8")
    rel = p.relative_to(dist)
    if str(rel).startswith(EXEMPT_PREFIX) or 'name="robots" content="noindex' in h:
        exempt += 1
        continue
    t = h.split("<title>", 1)[1].split("</title>", 1)[0] if "<title>" in h else ""
    checks = [
        (NAME in t, "<title> 不含备案名「%s」" % NAME),
        (ICP in h, "页脚没有备案号 %s" % ICP),
        ("https://beian.miit.gov.cn" in h, "备案号没有链到 beian.miit.gov.cn"),
        (MPS_NO in h, "页脚没有公安备案号 %s" % MPS_NO),
        (MPS_URL in h, "公安备案号没有链到公安备案查询"),
        ('src="/gongan-beian.png"' in h, "公安备案号前没有备案图标"),
    ]
    for ok, msg in checks:
        if not ok:
            problems.append("%s：%s" % (rel, msg))
if problems:
    print("✗ 备案硬闸未通过（%d 个问题），中止上线：" % len(problems), file=sys.stderr)
    for m in problems:
        print("  - " + m, file=sys.stderr)
    sys.exit(1)
print("  ✓ 备案硬闸通过：%d 个页面检查、%d 个豁免（noindex 页）" % (len(pages) - exempt, exempt))
