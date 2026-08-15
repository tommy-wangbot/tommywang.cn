#!/usr/bin/env bash
# 明鉴官网 · 常驻命令（基于 OrbStack 的 Docker）
# 把「npm run build && npm run preview」挂成后台常驻服务。
# 用法: ./site.sh <start|stop|restart|rebuild|logs|status>
set -euo pipefail
cd "$(dirname "$0")"

# 兼容 PATH 里没有 docker / node 的情况（OrbStack CLI 在 ~/.orbstack/bin，Node 在 Homebrew）
export PATH="/opt/homebrew/bin:$HOME/.orbstack/bin:$PATH"

usage() {
  cat <<'EOF'
用法: ./site.sh <命令>

  start    宿主侧 npm run build 后，构建镜像并启动常驻服务 → http://localhost:4321
  stop     停止并删除容器
  restart  重启容器（内容没改时最省事）
  rebuild  改完内容后：宿主侧重新 npm run build，让容器用上最新产物
  logs     跟随查看容器日志（Ctrl+C 退出）
  status   查看容器状态 / 健康检查
EOF
}

cmd="${1:-}"
case "$cmd" in
  start)   npm run build && docker compose up -d --build ;;
  stop)    docker compose down ;;
  restart) docker compose restart ;;
  rebuild) npm run build && docker compose restart ;;
  logs)    docker compose logs -f --tail=100 ;;
  status)  docker compose ps ;;
  *)       usage ;;
esac
