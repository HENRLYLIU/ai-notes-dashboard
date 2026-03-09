import {
  type HomeData,
  type LibraryData,
  type LibraryNote,
  type NewNoteMeta,
  type NewNotePayload,
  type NoteDetailData,
  type ReviewDetailData,
  type ReviewItem,
  type ReviewPageData,
  type ReviewResult,
  type Tone,
} from './types'

type MockDB = {
  reviewItems: ReviewItem[]
  libraryNotes: LibraryNote[]
  detailById: Record<string, ReviewDetailData>
  categories: Array<{ id: string; label: string }>
  smartReviewEnabled: boolean
}

const STORAGE_KEY = 'ai-notes-mock-db-v2'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function mockContent(title: string, category: string, index: number) {
  return `${title}\n\n这是第 ${index + 1} 条模拟笔记内容，用于前端联调。\n\n分类：${category}\n\n1. 核心概念\n2. 关键公式与例子\n3. 复习建议与自测题\n\n后续接入真实后端后，这里将替换为服务端返回的正文。`
}

function generateMockLibraryNotes(count = 20): LibraryNote[] {
  const categories = ['考研英语', '神经网络', '金融建模', '语言学习', '历史']
  const seeds = [
    'Transformer 架构深度解析',
    '2024 考研词汇核心 L5',
    '布莱克-舒尔斯模型推导',
    '德语 B1 常用语法短语',
    '工业革命中的制度变迁',
    'RNN 与 LSTM 训练技巧',
    '英语长难句拆解模板',
    '随机过程基础笔记',
    '强化学习策略梯度入门',
    '量化因子选股实战',
    '法语时态速记表',
    '注意力机制可视化',
    '统计套利框架搭建',
    'GRE 高频词根词缀',
    '卷积网络调参清单',
    '宏观经济指标速览',
    '西语口语场景表达',
    '机器学习评估指标',
    '概率图模型导读',
    '学习计划周复盘模板',
  ]

  return Array.from({ length: count }).map((_, idx) => {
    const category = categories[idx % categories.length]
    const memoryRate = 62 + ((idx * 7) % 33)
    const trend = idx % 3 === 0 ? 'up' : idx % 3 === 1 ? 'wave' : 'down'
    const day = 30 - (idx % 20)
    return {
      id: `note-${idx + 1}`,
      title: seeds[idx % seeds.length],
      summary: `关于${category}的知识点提炼与复习路径，含关键案例与注意事项。`,
      date: `2023.10.${String(day).padStart(2, '0')}`,
      category,
      memoryRate,
      trend,
      content: mockContent(seeds[idx % seeds.length], category, idx),
    }
  })
}

const seedDB: MockDB = {
  reviewItems: [
    {
      id: 'rev-1',
      title: '核心词汇与助记法',
      tag: '#考研英语',
      tagTone: 'primary',
      etaText: '14分钟',
      etaTone: 'coral',
      difficulty: 3,
    },
    {
      id: 'rev-2',
      title: '高级 React 模式：HOCs 与 Hooks',
      tag: '#技术栈',
      tagTone: 'mint',
      etaText: '2h 15m',
      etaTone: 'slate',
      difficulty: 4,
    },
    {
      id: 'rev-3',
      title: '工业革命动态',
      tag: '#历史',
      tagTone: 'coral',
      etaText: '4h 40m',
      etaTone: 'slate',
      difficulty: 2,
      faded: true,
    },
  ],
  libraryNotes: generateMockLibraryNotes(20),
  detailById: {
    'rev-1': {
      id: 'rev-1',
      title: '艾宾浩斯遗忘曲线原理',
      tags: ['#心理学', '#学习科学'],
      formula: 'R = e^(-t/S)',
      body: '遗忘的过程是有规律的，遗忘的进程很快，并且先快后慢。',
      insights: ['20分钟后记住约 58%', '1小时后记住约 44%', '1天后记住约 33%', '6天后记住约 25%'],
    },
    'rev-2': {
      id: 'rev-2',
      title: 'React 组合模式的边界',
      tags: ['#前端', '#工程化'],
      formula: 'UI = f(state)',
      body: '高阶组件适合横切能力复用，Hook 适合逻辑组合与局部状态。',
      insights: ['容器组件逻辑应收敛', '副作用尽量拆分为独立 Hook', '避免过度抽象导致可读性下降', '组件职责要单一'],
    },
    'rev-3': {
      id: 'rev-3',
      title: '工业革命中的制度与技术',
      tags: ['#历史', '#社会学'],
      formula: 'Productivity ∝ Tech × Institution',
      body: '技术变革与制度安排共同决定了产业扩张速度和持续性。',
      insights: ['蒸汽机提升运输效率', '工厂制度重塑分工', '资本市场加速扩散', '教育普及提升技能供给'],
    },
  },
  categories: [
    { id: 'cat-en', label: '英语' },
    { id: 'cat-tech', label: '科技' },
    { id: 'cat-fin', label: '金融' },
  ],
  smartReviewEnabled: true,
}

function saveDB(db: MockDB) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

function ensureNotes(db: MockDB): MockDB {
  if (!db.libraryNotes || db.libraryNotes.length === 0) {
    db.libraryNotes = generateMockLibraryNotes(20)
  }
  return db
}

function loadDB(): MockDB {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const init = ensureNotes(structuredClone(seedDB))
    saveDB(init)
    return init
  }

  try {
    const parsed = JSON.parse(raw) as Partial<MockDB>
    const merged: MockDB = {
      ...seedDB,
      ...parsed,
      reviewItems: parsed.reviewItems ?? seedDB.reviewItems,
      libraryNotes: parsed.libraryNotes ?? seedDB.libraryNotes,
      detailById: {
        ...seedDB.detailById,
        ...(parsed.detailById ?? {}),
      },
      categories: parsed.categories ?? seedDB.categories,
      smartReviewEnabled: parsed.smartReviewEnabled ?? seedDB.smartReviewEnabled,
    }
    const normalized = ensureNotes(merged)
    saveDB(normalized)
    return normalized
  } catch {
    const init = ensureNotes(structuredClone(seedDB))
    saveDB(init)
    return init
  }
}

function toneClass(tone: Tone) {
  switch (tone) {
    case 'primary':
      return 'primary'
    case 'mint':
      return 'mint'
    case 'coral':
      return 'coral'
    default:
      return 'slate'
  }
}

function noteTone(note: LibraryNote): Tone {
  if (note.memoryRate >= 90) return 'mint'
  if (note.memoryRate < 70) return 'coral'
  return 'primary'
}

function recentMeta(note: LibraryNote, index: number) {
  const clocks = ['2小时前创建', '5小时前创建', '昨天创建', '3天前创建']
  return `${clocks[index % clocks.length]} • ${note.category}`
}

export async function getHomeData(): Promise<HomeData> {
  await sleep(220)
  const db = loadDB()
  const pending = db.reviewItems.length
  const mastered = 100 + db.libraryNotes.filter((n) => n.memoryRate >= 80).length
  const recent = [...db.libraryNotes]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map((note, idx) => ({
      id: note.id,
      title: note.title,
      meta: recentMeta(note, idx),
      tone: noteTone(note),
    }))

  return {
    retentionRate: 85,
    trendDelta: '+5.2%',
    pendingCount: pending,
    masteredCount: mastered,
    trendPoints: [80, 70, 50, 60, 30, 10],
    reviewSequence: db.reviewItems,
    recentNotes: recent,
  }
}

export async function getReviewPageData(): Promise<ReviewPageData> {
  await sleep(220)
  const db = loadDB()
  return {
    completionRate: 60,
    pendingCount: db.reviewItems.length,
    completedCount: 8,
    streakDays: 15,
    reviewItems: db.reviewItems,
  }
}

export async function getReviewDetail(id: string): Promise<ReviewDetailData> {
  await sleep(180)
  const db = loadDB()
  return db.detailById[id] ?? db.detailById['rev-1']
}

export async function snoozeReview(id: string): Promise<void> {
  await sleep(180)
  const db = loadDB()
  db.reviewItems = db.reviewItems.map((item) =>
    item.id === id
      ? {
          ...item,
          etaText: '已延后 2h',
          etaTone: 'slate',
          faded: true,
        }
      : item,
  )
  saveDB(db)
}

export async function submitReviewResult(id: string, result: ReviewResult): Promise<void> {
  await sleep(220)
  const db = loadDB()
  db.reviewItems = db.reviewItems.filter((item) => item.id !== id)

  const detail = db.detailById[id]
  if (detail && result === 'mastered') {
    db.libraryNotes.unshift({
      id: `note-${Date.now()}`,
      title: detail.title,
      summary: '来自复习详情的已掌握笔记。',
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      category: '复习沉淀',
      memoryRate: 90,
      trend: 'up',
      content: `${detail.title}\n\n${detail.body}\n\n${detail.formula}`,
    })
  }
  saveDB(db)
}

export async function getNewNoteMeta(): Promise<NewNoteMeta> {
  await sleep(120)
  const db = loadDB()
  return {
    categories: db.categories.map((c, index) => ({ ...c, selected: index === 0 })),
    smartReviewEnabled: db.smartReviewEnabled,
  }
}

export async function createNote(payload: NewNotePayload): Promise<{ id: string }> {
  await sleep(300)
  const db = loadDB()
  const id = `note-${Date.now()}`
  const categoryLabel = db.categories.find((c) => payload.categoryIds.includes(c.id))?.label ?? '未分类'

  db.libraryNotes.unshift({
    id,
    title: payload.title.trim() || '未命名笔记',
    summary: (payload.content.trim() || '暂无摘要').slice(0, 60),
    date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    category: categoryLabel,
    memoryRate: 76,
    trend: 'wave',
    content: payload.content.trim() || '暂无内容',
  })

  if (payload.smartReviewEnabled) {
    db.reviewItems.unshift({
      id: `rev-${Date.now()}`,
      title: payload.title.trim() || '未命名笔记',
      tag: '#' + categoryLabel,
      tagTone: 'primary',
      etaText: '20分钟',
      etaTone: 'coral',
      difficulty: 3,
    })
  }

  db.smartReviewEnabled = payload.smartReviewEnabled
  saveDB(db)
  return { id }
}

export async function getLibraryData(): Promise<LibraryData> {
  await sleep(180)
  const db = loadDB()
  return {
    categories: ['全部', ...Array.from(new Set(db.libraryNotes.map((n) => n.category)))],
    notes: db.libraryNotes,
  }
}

export async function getNoteDetail(id: string): Promise<NoteDetailData> {
  await sleep(160)
  const db = loadDB()
  const note = db.libraryNotes.find((n) => n.id === id) ?? db.libraryNotes[0]
  return {
    id: note.id,
    title: note.title,
    date: note.date,
    category: note.category,
    memoryRate: note.memoryRate,
    summary: note.summary,
    content: note.content,
  }
}

export function getToneColorClass(tone: Tone) {
  switch (toneClass(tone)) {
    case 'primary':
      return 'text-primary'
    case 'mint':
      return 'text-mint'
    case 'coral':
      return 'text-coral'
    default:
      return 'text-slate-400'
  }
}

export function getToneBadgeClass(tone: Tone) {
  switch (toneClass(tone)) {
    case 'primary':
      return 'bg-primary/10 text-primary'
    case 'mint':
      return 'bg-mint/10 text-mint'
    case 'coral':
      return 'bg-coral/10 text-coral'
    default:
      return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
  }
}
