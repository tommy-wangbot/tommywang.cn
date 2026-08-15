import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** YAML 里写 2026-07-18，会被解析成 Date；统一 coerce */
    date: z.coerce.date(),
    /** 文首状态标签 */
    status: z.enum(['问题', '假设', '判断']),
    /** 已入账本时链向对应判断卡 */
    cardId: z.string().optional(),
    /** 一句摘要，用于「最近在想什么」列表 */
    excerpt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/** 案例（/mingjian/cases/<slug>）。两篇案例 frontmatter 统一为本 schema。 */
const cases = defineCollection({
  loader: glob({ base: './src/content/cases', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** 路由段，同时是文件名 */
    slug: z.string(),
    /** 摘要，用于页首与 meta description */
    summary: z.string(),
    /** 排序（明鉴页摘要卡与索引用） */
    order: z.number(),
    draft: z.boolean().default(false),
    /** 本案例挂出的判断卡 id，取自 cards.json */
    cards: z.array(z.string()).default([]),
  }),
});

/** 《认知资本论》试读（/research/cognitive-capital/<slug>） */
const excerpts = defineCollection({
  loader: glob({ base: './src/content/excerpts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    source: z.string(),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes, cases, excerpts };
