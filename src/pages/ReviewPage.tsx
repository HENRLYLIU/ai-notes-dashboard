import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReviewPageData, getToneBadgeClass, snoozeReview } from '../api/mockServer'
import type { ReviewPageData } from '../api/types'

export default function ReviewPage() {
  const [data, setData] = useState<ReviewPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const res = await getReviewPageData()
    setData(res)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const handleSnooze = async (id: string) => {
    setPendingId(id)
    await snoozeReview(id)
    await load()
    setPendingId(null)
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light text-slate-500 dark:bg-background-dark dark:text-slate-400">
        正在加载复习数据...
      </div>
    )
  }

  return (
    <div className="bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100 min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 flex items-center justify-between bg-background-light/80 px-6 py-4 backdrop-blur-md dark:bg-background-dark/80">
        <h1 className="text-2xl font-bold tracking-tight">复习</h1>
        <div className="flex gap-4">
          <button className="rounded-full p-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="rounded-full p-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 px-4 pb-24">
        <section className="mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">今日任务完成度</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">坚持就是胜利，加油！</p>
              </div>
              <div className="relative flex items-center justify-center">
                <svg className="h-16 w-16 -rotate-90 transform">
                  <circle className="text-slate-200 dark:text-slate-800" cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" />
                  <circle className="text-primary" cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeDasharray="176" strokeDashoffset={176 - (176 * data.completionRate) / 100} strokeWidth="6" />
                </svg>
                <span className="absolute text-sm font-bold">{data.completionRate}%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800/50">
                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">待复习</p>
                <p className="text-xl font-bold text-primary">{data.pendingCount}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800/50">
                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">已复习</p>
                <p className="text-xl font-bold text-emerald-500">{data.completedCount}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800/50">
                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">连续学习</p>
                <p className="text-xl font-bold text-amber-500">{data.streakDays}天</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold">智能复习列表</h3>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">AI 优化排序</span>
          </div>
          <div className="space-y-4">
            {data.reviewItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 ${item.faded ? 'opacity-80' : ''}`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="text-lg font-bold leading-snug">{item.title}</h4>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${getToneBadgeClass(item.tagTone)}`}>{item.tag}</span>
                </div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">难度:</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={`${item.title}-star-${i}`}
                          className={`material-symbols-outlined text-sm ${
                            i < item.difficulty ? 'fill-icon text-amber-400' : 'text-slate-300 dark:text-slate-700'
                          }`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-slate-400">timer</span>
                    <span className="text-xs font-medium text-slate-400">遗忘临界点: {item.etaText}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to={`/review/detail/${item.id}`} className="flex-1 rounded-lg bg-primary py-2 text-center text-sm font-bold text-white shadow-lg shadow-primary/20">
                    开始复习
                  </Link>
                  <button
                    onClick={() => void handleSnooze(item.id)}
                    disabled={pendingId === item.id}
                    className="flex-1 rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-700 disabled:opacity-60 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {pendingId === item.id ? '处理中...' : '稍后提醒'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/80 px-2 pb-6 pt-2 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-md items-center justify-around">
          <Link className="flex flex-col items-center gap-1 px-4 py-2 text-slate-400" to="/">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-medium leading-none">主页</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 px-4 py-2 text-primary" to="/review">
            <span className="material-symbols-outlined fill-icon">history</span>
            <span className="text-[10px] font-bold leading-none">复习</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 px-4 py-2 text-slate-400" to="/library">
            <span className="material-symbols-outlined">auto_stories</span>
            <span className="text-[10px] font-medium leading-none">库</span>
          </Link>
          <a className="flex flex-col items-center gap-1 px-4 py-2 text-slate-400" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] font-medium leading-none">设置</span>
          </a>
        </div>
      </div>
    </div>
  )
}
