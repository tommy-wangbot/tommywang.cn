// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 王少怀的研究笔记 · 静态站构建配置
// 全站纯静态输出；不引用任何外部 CDN 资源。
export default defineConfig({
  site: 'https://tommywang.cn',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    // 构建期生成 sitemap-index.xml + sitemap-0.xml，纯静态产物，不引外部资源。
    // /admin/ 是写作台，已在 BaseLayout 里标 noindex，这里同步排除出站点地图。
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  build: {
    format: 'directory',
    // 内联小体积样式，减少请求；不引外链
    inlineStylesheets: 'auto',
  },
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
  devToolbar: { enabled: false },
});
