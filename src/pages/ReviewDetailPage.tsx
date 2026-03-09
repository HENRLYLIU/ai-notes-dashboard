import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getReviewDetail, submitReviewResult } from '../api/mockServer'
import type { ReviewDetailData, ReviewResult } from '../api/types'

export default function ReviewDetailPage() {
  const navigate = useNavigate()
  const { id = 'rev-1' } = useParams()
  const [data, setData] = useState<ReviewDetailData | null>(null)
  const [submitting, setSubmitting] = useState<ReviewResult | null>(null)

  useEffect(() => {
    let active = true
    getReviewDetail(id).then((res) => {
      if (!active) return
      setData(res)
    })
    return () => {
      active = false
    }
  }, [id])

  const handleSubmit = async (result: ReviewResult) => {
    setSubmitting(result)
    await submitReviewResult(id, result)
    navigate('/review')
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light text-slate-500 dark:bg-background-dark dark:text-slate-400">
        正在加载复习详情...
      </div>
    )
  }

  return (
    <div className="bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100 min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-background-light/80 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80">
        <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">复习详情</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">3</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">/ 12</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4">
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="group relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative flex h-full w-full items-center justify-center p-8">
              <div className="relative h-full w-full border-b-2 border-l-2 border-slate-400 dark:border-slate-600">
                <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path className="text-primary" d="M 0,10 Q 20,10 40,50 T 100,80" fill="none" stroke="currentColor" strokeWidth="3" />
                  <circle className="text-primary" cx="0" cy="10" r="3" fill="currentColor" />
                  <circle className="text-primary" cx="20" cy="10" r="2" fill="currentColor" />
                </svg>
                <div className="absolute bottom-2 right-2 text-[10px] text-slate-500">时间 (t)</div>
                <div className="absolute left-2 top-2 origin-left rotate-90 text-[10px] text-slate-500">记忆量 (R)</div>
              </div>
            </div>
            <div className="absolute right-4 top-4 rounded-full border border-primary/30 bg-primary/20 px-3 py-1 backdrop-blur-sm">
              <span className="text-xs font-medium text-primary">图表可视化</span>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">{data.title}</h2>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{tag}</span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-sm">functions</span>
                <h3 className="text-sm font-bold uppercase tracking-wider">核心内容</h3>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <p className="mb-3 leading-relaxed text-slate-700 dark:text-slate-300">{data.body}</p>
                <div className="flex justify-center py-2">
                  <code className="font-display text-xl font-bold text-primary">{data.formula}</code>
                </div>
                <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">其中 R 代表记忆存留量，S 代表记忆强度，t 代表时间</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-sm">lightbulb</span>
                <h3 className="text-sm font-bold uppercase tracking-wider">关键洞察</h3>
              </div>
              <ul className="space-y-3">
                {data.insights.map((insight) => {
                  const [prefix, value] = insight.split(/ (\d+%)/)
                  return (
                    <li key={insight} className="flex items-start gap-3">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {prefix} <span className="font-bold text-primary">{value?.trim() ?? ''}</span>
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex flex-col items-center gap-3">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">对原文有疑问？</p>
                <button className="group flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-primary transition-all hover:bg-primary/10 active:scale-[0.98]">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span className="text-sm font-bold tracking-wide">AI 深度解析</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="safe-area-bottom border-t border-slate-200 bg-background-light p-4 dark:border-slate-800 dark:bg-background-dark">
        <div className="mx-auto flex max-w-2xl gap-3">
          <button
            onClick={() => void handleSubmit('forgot')}
            disabled={submitting !== null}
            className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/10 px-2 py-3 transition-all hover:bg-[#ff6b6b]/20 disabled:opacity-60 active:scale-95"
          >
            <span className="material-symbols-outlined text-[#ff6b6b]">sentiment_dissatisfied</span>
            <span className="text-xs font-bold text-[#ff6b6b]">{submitting === 'forgot' ? '提交中...' : '忘记了'}</span>
          </button>
          <button
            onClick={() => void handleSubmit('fuzzy')}
            disabled={submitting !== null}
            className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-[#2ec4b6]/20 bg-[#2ec4b6]/10 px-2 py-3 transition-all hover:bg-[#2ec4b6]/20 disabled:opacity-60 active:scale-95"
          >
            <span className="material-symbols-outlined text-[#2ec4b6]">sentiment_neutral</span>
            <span className="text-xs font-bold text-[#2ec4b6]">{submitting === 'fuzzy' ? '提交中...' : '模糊'}</span>
          </button>
          <button
            onClick={() => void handleSubmit('mastered')}
            disabled={submitting !== null}
            className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-primary/20 bg-primary/10 px-2 py-3 transition-all hover:bg-primary/20 disabled:opacity-60 active:scale-95"
          >
            <span className="material-symbols-outlined text-primary">sentiment_satisfied</span>
            <span className="text-xs font-bold text-primary">{submitting === 'mastered' ? '提交中...' : '已掌握'}</span>
          </button>
        </div>
      </footer>
      <Link to="/" className="sr-only">返回首页</Link>
    </div>
  )
}
