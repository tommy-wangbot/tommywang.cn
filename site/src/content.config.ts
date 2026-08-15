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

/** 案例（/method/cases/<slug>）。两篇案例 frontmatter 统一为本 schema。 */
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

/**
 * 《认知资本论》手稿（/research/cognitive-capital/manuscript/<slug>）。
 * 按「部」切分：序言 + 五部 + 尾声，共 7 个单位。公开编制——未成稿的部分
 * 同样进集合，只是 published: false，索引页照常挂出标题与提要。
 */
const manuscript = defineCollection({
  loader: glob({ base: './src/content/manuscript', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number(),
    /** 写作状态：读者据此判断这一部能不能当定论看 */
    status: z.enum(['成稿', '在写', '待改']),
    /** 正文是否已公开。false 时索引页只挂标题+提要，不生成阅读页 */
    published: z.boolean().default(false),
    /** 最后改动日期，与判断卡的「复核日期」同一套语言 */
    checked: z.coerce.date(),
    summary: z.string(),
  }),
});

export const collections = { notes, cases, excerpts, manuscript };
