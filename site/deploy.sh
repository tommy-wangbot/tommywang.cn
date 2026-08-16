#!/usr/bin/env bash
# 明鉴官网 V2 · 一键上线部署脚本 (tommywang.cn)
#
# 架构：Astro SSG 静态构建 → rsync 增量同步至阿里云 ECS → 远程备份与权限对齐 → Nginx 平滑重载 → 线上探活
#
# 用法：
#   ./deploy.sh              正常构建并发布到线上生产环境
#   ./deploy.sh --dry-run    只模拟同步，不实际改动服务器
#
set -euo pipefail
cd "$(dirname "$0")"

REMOTE_HOST="tommyweb"
REMOTE_DIR="/var/www/tommywang.cn"
BACKUP_DIR="/var/backups/site"
DRY_RUN=0

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    -h|--help)
      echo "用法: $0 [--dry-run]"
      exit 0 ;;
  esac
done

echo "=========================================="
echo "🚀 明鉴官网 V2 · 生产部署流水线"
echo "🌐 目标站点: https://tommywang.cn"
echo "=========================================="

# 1. 检查 SSH 连接
echo "▶ 1/5 检查服务器连接 (ssh $REMOTE_HOST)..."
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 "$REMOTE_HOST" echo "✓ 服务器连接正常" >/dev/null 2>&1; then
  echo "✗ 错误：无法通过 SSH 连接到 $REMOTE_HOST，请检查网络或 ~/.ssh/config 配置。" >&2
  exit 1
fi
echo "  ✓ 服务器连接正常"

# 2. 本地 Astro 静态构建
echo "▶ 2/5 正在本地构建 Astro 静态产物..."
npm run build
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
  echo "✗ 错误：构建失败，未找到 dist/index.html" >&2
  exit 1
fi
echo "  ✓ 本地构建完成，产物已就绪 (dist/)"

if [ "$DRY_RUN" -eq 1 ]; then
  echo "▶ [DRY-RUN] 模拟同步预览："
  rsync -avz --dry-run --delete dist/ "$REMOTE_HOST:$REMOTE_DIR/"
  echo "=========================================="
  echo "✓ 演习完成（未改动线上生产环境）。"
  exit 0
fi

# 3. 远端自动备份当前线上版本
echo "▶ 3/5 正在服务器上创建当前版本备份..."
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ssh "$REMOTE_HOST" "mkdir -p $BACKUP_DIR && if [ -d $REMOTE_DIR ] && [ -f $REMOTE_DIR/index.html ]; then tar -czf $BACKUP_DIR/site-pre-$TIMESTAMP.tar.gz -C $REMOTE_DIR . ; echo '  ✓ 线上旧版已备份到 $BACKUP_DIR/site-pre-$TIMESTAMP.tar.gz'; fi"

# 4. 增量同步到 Web 根目录
echo "▶ 4/5 正在增量同步静态产物到服务器 ($REMOTE_DIR)..."
rsync -avz --delete dist/ "$REMOTE_HOST:$REMOTE_DIR/"
ssh "$REMOTE_HOST" "chown -R www-data:www-data $REMOTE_DIR && chmod -R 755 $REMOTE_DIR && systemctl reload nginx"
echo "  ✓ 文件同步完成，Nginx 已平滑重载"

# 5. 线上探活与备案信息验证
echo "▶ 5/5 正在发起线上生产环境健康检查..."
sleep 1
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://tommywang.cn/)
RESEARCH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://tommywang.cn/research/)

if [ "$HTTP_STATUS" -eq 200 ] && [ "$RESEARCH_STATUS" -eq 200 ]; then
  echo "  ✓ 首页健康检查通过 (HTTP 200)"
  echo "  ✓ 研究页健康检查通过 (HTTP 200)"
  echo "=========================================="
  echo "🎉 部署成功！最新版已正式上线："
  echo "👉 首页: https://tommywang.cn"
  echo "👉 研究与判断: https://tommywang.cn/research/"
  echo "👉 写作台: https://tommywang.cn/admin/"
  echo "=========================================="
else
  echo "⚠️ 警告：线上返回状态码异常 (首页: $HTTP_STATUS, 研究页: $RESEARCH_STATUS)，请检查！"
fi
