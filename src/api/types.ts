export type Tone = 'primary' | 'mint' | 'coral' | 'slate'

export type ReviewItem = {
  id: string
  title: string
  tag: string
  tagTone: Tone
  etaText: string
  etaTone: Tone
  difficulty: number
  faded?: boolean
}

export type RecentNote = {
  id: string
  title: string
  meta: string
  tone: Tone
}

export type HomeData = {
  retentionRate: number
  trendDelta: string
  pendingCount: number
  masteredCount: number
  trendPoints: number[]
  reviewSequence: ReviewItem[]
  recentNotes: RecentNote[]
}

export type ReviewPageData = {
  completionRate: number
  pendingCount: number
  completedCount: number
  streakDays: number
  reviewItems: ReviewItem[]
}

export type ReviewDetailData = {
  id: string
  title: string
  tags: string[]
  formula: string
  body: string
  insights: string[]
}

export type Category = {
  id: string
  label: string
  selected?: boolean
}

export type NewNoteMeta = {
  categories: Category[]
  smartReviewEnabled: boolean
}

export type NewNotePayload = {
  title: string
  content: string
  categoryIds: string[]
  smartReviewEnabled: boolean
}

export type ReviewResult = 'forgot' | 'fuzzy' | 'mastered'

export type LibraryNote = {
  id: string
  title: string
  summary: string
  date: string
  category: string
  memoryRate: number
  trend: 'up' | 'down' | 'wave'
  content: string
}

export type LibraryData = {
  categories: string[]
  notes: LibraryNote[]
}

export type NoteDetailData = {
  id: string
  title: string
  date: string
  category: string
  memoryRate: number
  content: string
  summary: string
}
