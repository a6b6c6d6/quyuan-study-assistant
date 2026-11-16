export interface ExperienceCard {
  id: string
  title: string
  tags: string[]
  points: string[]
}

export const EXPERIENCES: ExperienceCard[] = [
  {
    id: 'math-errorbook',
    title: '数学错题二刷',
    tags: ['数学', '复盘'],
    points: [
      '第一遍只标错因，不抄整题，省下整理时间。',
      '隔两天闭卷重做，只做错题和同类变式。',
      '第二次仍错的题，写进“考前只看这一页”清单。',
    ],
  },
  {
    id: 'english-words',
    title: '英语单词滚动复习',
    tags: ['英语', '记忆'],
    points: [
      '每天新词 20 个，同时复习前两天学过的旧词。',
      '早读先过一遍，晚上遮住中文自测。',
      '只记真题高频义，不必追求全部释义。',
    ],
  },
  {
    id: 'politics-choice',
    title: '政治选择题节奏',
    tags: ['政治', '刷题'],
    points: [
      '每天固定 5 题，做完立刻对答案，不攒题。',
      '错题回到精讲精练对应章节，标出关键词。',
      '周末只重做本周错题，不盲目追加新题。',
    ],
  },
]
