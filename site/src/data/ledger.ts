/**
 * 判断账本的非完整卡内容。
 * 判断层（完整卡）在 cards.json；这里只放问题层与假设层。
 * 铁律：写不出失效条件的命题不上卡——所以它们停在这两层。
 */

export interface LedgerQuestion {
  id: string;
  question: string;
  note: string;
}

export interface LedgerHypothesis {
  /** 锚点 id：/research/ledger/#card-<id> */
  id: string;
  file: string;
  proposition: string;
  /** 当前证据状态 */
  support: string;
  counter: string;
  conclusion: string;
  upgrade: string[];
  downgrade: string[];
  confidence: string;
  openedAt: string;
  reviewedAt: string;
}

/** 问题层：我还没有答案，一行即可。 */
export const QUESTIONS: LedgerQuestion[] = [
  {
    id: 'Q-001',
    question: '把一个人的判断沉淀成系统之后，接手的人获得的是判断力本身，还是判断的外壳？',
    note: '判断卡、演化记录与红队机制能把推理过程完整留下来，但留下来的是结论与理由，不是形成结论时的那种体感——对潜台词的解码、对各方心理承受极限的测绘。理论上这是「行业体感属于不可符号化的那一半」的直接推论，但我手上没有可观察的检验方式：无法设计一个信号来判定接手者到底继承了什么。写不出失效条件，按铁律它只能停在问题层。',
  },
];

/** 假设层：有初步解释，证据不充分。短段落形态，不上完整卡。 */
export const HYPOTHESES: LedgerHypothesis[] = [
  {
    id: 'HY-001',
    file: 'hypotheses/HY-001.md',
    proposition:
      '组织正在从金字塔坍缩为「一个判断核 + 一片执行云」的形态，科层制中间层因翻译职能失效而被整体拆除。',
    support:
      '中间层的三项核心职能——信息上传下达、材料汇总、例行审批——恰好是大模型的甜蜜区。当判断者的意图可以无衰减地同步到执行末端、一线信号可以被实时压缩成决策视图，科层制作为「判断降解器」的存在理由就被削弱了。裁员最狠的公司往往业绩最好，也支持「换器官而非紧缩」的解释。',
    counter:
      '在编制刚性强的组织里，中间层不是被拆除，而是被制度性地保护。取消某一层级的管理编制会立刻遭遇集中反弹，且反弹理由是可辩护的——审批权与安全责任在监管口径上必须对应任职等级，由下一级代行在合规上不成立。这类组织的坍缩更可能表现为「职责重排」而不是「层级消失」，并且会显著滞后于市场化组织。',
    conclusion:
      '支持面来自趋势推演，反证面来自我手上唯一的一手样本，且方向相反。证据不充分，因此按铁律停在假设层，不上完整判断卡。',
    upgrade: [
      'AI 高渗透行业中，中层管理者占从业人数的比重连续三年下降，且降幅显著高于一线执行岗；',
      '同时，在编制刚性组织中出现至少两例「层级真实减少、且未在别处以新名目复原」的完整案例。',
    ],
    downgrade: [
      '大型组织的平均管理层级数在 AI 大规模应用后不减反增；',
      '裁员持续集中在一线执行岗而非中间层。',
    ],
    confidence: '0.55 · 假设层估值，未立卡',
    openedAt: '2026-08-03',
    reviewedAt: '2026-08-03',
  },
];
