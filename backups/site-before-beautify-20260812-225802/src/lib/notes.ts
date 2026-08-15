import { getCollection } from 'astro:content';

export interface NoteItem {
  slug: string;
  title: string;
  date: string;
  status: string;
  cardId?: string;
  excerpt?: string;
}

/** 统一日期格式 YYYY-MM-DD（避免时区导致的差一天） */
export function fmtDate(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}-${p(date.getUTCMonth() + 1)}-${p(date.getUTCDate())}`;
}

/** 「最近在想什么」的唯一数据源：明鉴页脚 2-3 篇、研究伞页 5 篇同源。 */
export async function recentNotes(limit?: number): Promise<NoteItem[]> {
  const entries = await getCollection('notes', (e: any) => !e.data.draft);
  const list: NoteItem[] = entries.map((e: any) => ({
    slug: e.id,
    title: e.data.title,
    date: fmtDate(e.data.date),
    status: e.data.status,
    cardId: e.data.cardId,
    excerpt: e.data.excerpt,
  }));
  list.sort((a, b) => (a.date < b.date ? 1 : -1));
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}
