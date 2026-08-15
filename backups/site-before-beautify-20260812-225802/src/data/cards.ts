import raw from './cards.json';

export interface Revision {
  date: string;
  note: string;
}

export interface CardLink {
  href: string;
  label: string;
}

export interface JudgmentCardData {
  id: string;
  /** 公理 / 推论 / 组织 / 案例 / 投资 */
  kind: string;
  /** 卡片文件名，显示在卡首（账本感） */
  file?: string;
  /** 卡首优先级标注，如 high */
  priority?: string;
  /** 尚未定稿，卡上打「待定稿」 */
  draft?: boolean;
  /** 投资类：自动附加不构成投资建议声明 */
  investment?: boolean;
  /** 卡片标题（可选，示例卡用） */
  title?: string;
  /** 判断（一句话）／当前押注 */
  judgment: string;
  /** 置信度 0–1 */
  confidence: number;
  confidenceNote?: string;
  /** 主要依据 */
  basis?: string[];
  /** 最弱假设（可选） */
  weakest?: string;
  /** 反证信号（可选） */
  counter?: string;
  /** 失效条件：一条或多条 */
  falsifier: string | string[];
  /** 入账日期 */
  openedAt: string;
  /** 最近复核 */
  reviewedAt: string;
  /** 修订记录（追加不删改） */
  revisions?: Revision[];
  /** 证据锚点 */
  anchors?: string[];
  /** 关联页面（如案例页） */
  link?: CardLink;
}

export const CARDS: JudgmentCardData[] = (raw as { cards: JudgmentCardData[] }).cards;

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
