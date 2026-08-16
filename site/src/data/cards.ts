import raw from './cards.json';

export interface Revision {
  date: string;
  /** 入账（首次立卡）或 复核（此后每一轮） */
  type: '入账' | '复核';
  /** 置信度变动，如 0.60 → 0.45 */
  delta?: string;
  note: string;
}

export interface CardLink {
  href: string;
  label: string;
}

export interface JudgmentCardData {
  /** JUG-TW-<日期>-<序号>；案例卡沿用 CS-<项目>-<序号> */
  id: string;
  /** 筛选用的领域短名：中国宏观 / 认知政治经济学 / 案例 */
  kind: string;
  /** 领域全称，显示在卡首 id 旁 */
  domain?: string;
  /** 卡片文件名（账本感） */
  file?: string;
  /** 争议状态，如 disputed */
  status?: string;
  statusNote?: string;
  /** 不进公开判断记录（案例卡内嵌在项目页） */
  offLedger?: boolean;
  /** 投资类：自动附加不构成投资建议声明 */
  investment?: boolean;
  title?: string;
  /** 判断（一句话）／当前押注 */
  judgment: string;
  /** 置信度 0–1 */
  confidence: number;
  confidenceNote?: string;
  basis?: string[];
  weakest?: string;
  counter?: string;
  /** 失效条件：一条或多条 */
  falsifier: string | string[];
  /** 来源说明 */
  source?: string;
  openedAt: string;
  reviewedAt: string;
  /** 修订记录（追加不删改） */
  revisions?: Revision[];
  anchors?: string[];
  link?: CardLink;
}

export const CARDS: JudgmentCardData[] = (raw as { cards: JudgmentCardData[] }).cards;

/** 进公开判断记录的卡（案例卡内嵌在项目页，不进账本） */
export const LEDGER_CARDS: JudgmentCardData[] = CARDS.filter((c) => !c.offLedger);

export function getCard(id: string): JudgmentCardData {
  const card = CARDS.find((c) => c.id === id);
  if (!card) throw new Error(`cards.json 中找不到判断卡：${id}`);
  return card;
}

export function getCards(...ids: string[]): JudgmentCardData[] {
  return ids.map(getCard);
}

export function cardsByKind(kind: string): JudgmentCardData[] {
  return CARDS.filter((c) => c.kind === kind);
}

/** 最近一轮复核（不含入账），没有则 null */
export function lastReview(card: JudgmentCardData): Revision | null {
  const revs = (card.revisions ?? []).filter((r) => r.type === '复核');
  return revs.length > 0 ? revs[revs.length - 1] : null;
}

/** 全账本的变动流，日期倒序 */
export function ledgerChanges(): Array<Revision & { card: string; confidence: number }> {
  return LEDGER_CARDS.flatMap((c) =>
    (c.revisions ?? []).map((r) => ({ ...r, card: c.id, confidence: c.confidence }))
  ).sort((a, b) => (a.date < b.date ? 1 : -1));
}
