/** 全站唯一常量源。站名必须一字不差：王少怀的研究笔记 */
export const SITE = {
  name: '王少怀的研究笔记',
  tagline: '把杂乱信息，炼成可信的判断',
  email: 'wsh@tommywang.cn',
  icp: '冀ICP备2026030491号-1',
  mps: '冀公网安备13063402000302号',
  mpsUrl: 'https://beian.mps.gov.cn/#/query/webSearch?code=13063402000302',
  /** 画布 1b：两扇门 → 三个栏目，笔记升格进导航 */
  doors: [
    { label: '工作方法', href: '/method/' },
    { label: '研究与判断', href: '/research/' },
    { label: '笔记', href: '/notes/' },
  ],
} as const;
