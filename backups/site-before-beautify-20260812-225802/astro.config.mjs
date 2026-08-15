// @ts-check
import { defineConfig } from 'astro/config';

// 王少怀的研究笔记 · 静态站构建配置
// 全站纯静态输出；不引用任何外部 CDN 资源。
export default defineConfig({
  site: 'https://tommywang.cn',
  output: 'static',
  trailingSlash: 'ignore',
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
