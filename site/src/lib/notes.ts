import { getCollection } from 'astro:content';
import { LEDGER_CARDS } from '../data/cards';

export interface NoteItem {
  slug: string;
  title: string;
  date: string;
  status: string;
  /** 文章（长文，/research/）或 笔记（弱信号，/notes/） */
  kind: '文章' | '笔记';
  /** 已挂的判断卡。单卡与多卡在这里统一成数组，渲染侧不用再分支 */
  cardIds: string[];
  excerpt?: string;
}

/** 取一篇内容挂的全部卡号：cardId（单）与 cardIds（多）合并去重 */
export function cardIdsOf(data: any): string[] {
  const list: string[] = [];
  if (data?.cardId) list.push(data.cardId);
  for (const id of data?.cardIds ?? []) if (!list.includes(id)) list.push(id);
  return list;
}

/** 卡号 → 卡标题（用在页脚与列表，标明挂的是哪几条判断） */
export function cardTitle(id: string): string | undefined {
  return LEDGER_CARDS.find((c) => c.id === id)?.title;
}

/** 统一日期格式 YYYY-MM-DD（避免时区导致的差一天） */
export function fmtDate(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}-${p(date.getUTCMonth() + 1)}-${p(date.getUTCDate())}`;
}

/**
 * 全部条目，按日期倒序。
 * kind 传入时只返回该栏目的内容——一份内容只属于一个栏目。
 */
export async function recentNotes(limit?: number, kind?: '文章' | '笔记'): Promise<NoteItem[]> {
  const entries = await getCollection('notes', (e: any) => !e.data.draft);
  let list: NoteItem[] = entries.map((e: any) => ({
    slug: e.id,
    title: e.data.title,
    date: fmtDate(e.data.date),
    status: e.data.status,
    kind: e.data.kind ?? '笔记',
    cardIds: cardIdsOf(e.data),
    excerpt: e.data.excerpt,
  }));
  if (kind) list = list.filter((n) => n.kind === kind);
  list.sort((a, b) => (a.date < b.date ? 1 : -1));
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}
