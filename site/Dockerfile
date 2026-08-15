# 明鉴官网 · 常驻预览容器
# 静态产物由宿主 Node 的 `npm run build` 生成并 COPY 进来；
# 容器内只安装 astro（运行时预览用），走 npmmirror 加速，避免 Docker Hub。
FROM node:22-alpine

WORKDIR /app

# 只装运行时依赖 astro（registry 用国内 npmmirror，快且稳定）
COPY package.json package-lock.json ./
RUN npm ci --registry=https://registry.npmmirror.com

# 宿主侧在 build 时已生成的静态产物（./site.sh start 会先跑 npm run build）
COPY dist ./dist

# 常驻预览；--host 0.0.0.0 让容器外（宿主机 / 局域网）都能访问
CMD ["./node_modules/.bin/astro", "preview", "--host", "0.0.0.0"]
