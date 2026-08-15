#!/bin/zsh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SNAPSHOT="$ROOT/backups/site-before-beautify-20260812-225802"
printf '即将用改造前快照覆盖 %s/site。输入 RESTORE 继续： ' "$ROOT"
read -r CONFIRM
if [[ "$CONFIRM" != "RESTORE" ]]; then
  print '已取消，未修改任何文件。'
  exit 0
fi
rsync -a --delete --exclude='node_modules' --exclude='dist' "$SNAPSHOT/" "$ROOT/site/"
print '已恢复改造前源码。请在 site 目录执行 npm run build 验证。'
