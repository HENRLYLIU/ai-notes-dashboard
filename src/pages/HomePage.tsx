import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHomeData, getToneBadgeClass, getToneColorClass } from '../api/mockServer'
import type { HomeData } from '../api/types'

export default function HomePage() {
  const reviewScrollerRef = useRef<HTMLDivElement>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'trend' | 'algorithm' | null>(null)

  useEffect(() => {
    let active = true
    getHomeData().then((res) => {
      if (!active) return
      setData(res)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const handleReviewScroll = () => {
    const scroller = reviewScrollerRef.current
    if (!scroller || !data) return
    const step = scroller.clientWidth - 16
    if (step <= 0) return
    const next = Math.round(scroller.scrollLeft / step)
    setSlideIndex(Math.max(0, Math.min(data.reviewSequence.length - 1, next)))
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light text-slate-500 dark:bg-background-dark dark:text-slate-400">
        正在加载首页数据...
      </div>
    )
  }

  return (
    <div className="bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100 min-h-screen pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-background-light/80 p-4 backdrop-blur-md dark:bg-background-dark/80">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
          <h1 className="text-xl font-bold tracking-tight">记忆AI</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/notes/new" className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary/90">
            <span className="material-symbols-outlined text-lg">add</span>
            <span>新建笔记</span>
          </Link>
          <button className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <section className="px-4 py-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mb-6 flex items-center justify-between gap-6">
            <div className="relative flex h-16 w-32 flex-col items-center overflow-hidden">
              <div className="gauge-conic h-32 w-32 rounded-full" />
              <div className="absolute bottom-0 text-center">
                <span className="text-2xl font-bold">{data.retentionRate}%</span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">记忆留存率</span>
                  <button onClick={() => setModal('algorithm')} className="inline-flex">
                    <span className="material-symbols-outlined text-[12px] opacity-60">info</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3 dark:bg-slate-800/50">
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500">待复习</p>
                  <p className="text-xl font-bold text-coral">{data.pendingCount}</p>
                </div>
                <span className="material-symbols-outlined text-coral">notification_important</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3 dark:bg-slate-800/50">
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500">已掌握</p>
                  <p className="text-xl font-bold text-mint">{data.masteredCount}</p>
                </div>
                <span className="material-symbols-outlined text-mint">verified</span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-400">
                7日记忆留存趋势{' '}
                <button onClick={() => setModal('trend')} className="inline-flex align-middle">
                  <span className="material-symbols-outlined ml-1 inline align-middle text-[14px] opacity-60">info</span>
                </button>
              </p>
              <span className="flex items-center text-xs font-bold text-mint">{data.trendDelta}</span>
            </div>
            <div className="relative h-24 w-full">
              <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2969ff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2969ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,80 Q50,70 100,50 T200,60 T300,30 T400,10 L400,100 L0,100 Z" fill="url(#chartGradient)" />
                <path d="M0,80 Q50,70 100,50 T200,60 T300,30 T400,10" fill="none" stroke="#2969ff" strokeLinecap="round" strokeWidth="3" />
              </svg>
              <div className="mt-1 flex justify-between px-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <span key={`${day}-${idx}`} className="text-[10px] text-slate-500">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between px-4">
          <h2 className="text-lg font-bold">今日复习序列</h2>
          <Link to="/review" className="text-sm font-medium text-primary">查看全部</Link>
        </div>
        <div
          ref={reviewScrollerRef}
          onScroll={handleReviewScroll}
          className="no-scrollbar flex snap-x snap-mandatory scroll-smooth gap-4 overflow-x-auto px-4 pb-4"
        >
          {data.reviewSequence.map((card) => (
            <div
              key={card.id}
              className="first:ml-4 last:mr-4 min-w-[calc(100%-2rem)] snap-center rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-start justify-between">
                <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${getToneBadgeClass(card.tagTone)}`}>{card.tag}</span>
                <div className={`flex items-center gap-1 ${getToneColorClass(card.etaTone)}`}>
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span className="text-xs font-bold">{card.etaText}</span>
                </div>
              </div>
              <h3 className="mb-4 text-lg font-bold leading-tight">{card.title}</h3>
              <div className="flex gap-2">
                <Link
                  to={`/review/detail/${card.id}`}
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-center text-sm font-semibold transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  详情
                </Link>
                <Link
                  to={`/review/detail/${card.id}`}
                  className="flex-1 rounded-lg bg-primary py-2 text-center text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
                >
                  快速回想
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center px-4">
          <div className="h-1 w-[60px] overflow-hidden rounded-full bg-[rgba(42,107,255,0.1)]">
            <div
              className="h-full w-1/3 rounded-full bg-[#2A6BFF] shadow-[0_0_8px_rgba(42,107,255,0.8)] transition-all duration-300"
              style={{ transform: `translateX(${slideIndex * 100}%)` }}
            />
          </div>
        </div>
      </section>

      <section className="mt-4 px-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold">最近笔记</h2>
        </div>
        <div className="space-y-3">
          {data.recentNotes.map((note) => (
            <div key={note.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className={`flex size-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 ${getToneColorClass(note.tone)}`}>
                <span className="material-symbols-outlined">description</span>
              </div>
              <div className="flex-1">
                <Link to={`/notes/${note.id}`} className="font-bold">
                  {note.title}
                </Link>
                <p className="text-xs text-slate-500">{note.meta}</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">more_vert</span>
            </div>
          ))}
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-slate-200 bg-white/95 px-6 py-3 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95">
        <Link className="flex flex-col items-center gap-1 text-primary" to="/">
          <span className="material-symbols-outlined font-variation-fill">home</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">主页</span>
        </Link>
        <Link className="flex flex-col items-center gap-1 text-slate-400" to="/review">
          <span className="material-symbols-outlined">school</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">复习</span>
        </Link>
        <Link className="flex flex-col items-center gap-1 text-slate-400" to="/library">
          <span className="material-symbols-outlined">folder</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">库</span>
        </Link>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">设置</span>
        </a>
      </nav>

      {modal === 'trend' && (
        <div className="fixed inset-0 z-[70] flex min-h-screen w-full flex-col justify-end bg-black/60" onClick={() => setModal(null)}>
          <div
            className="flex w-full flex-col overflow-hidden rounded-t-xl border-t border-[#ec5b13]/10 bg-[#221610] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-6 w-full items-center justify-center">
              <div className="h-1.5 w-10 rounded-full bg-[#ec5b13]/30" />
            </div>
            <div className="flex items-center border-b border-[#ec5b13]/10 px-4 py-2">
              <button className="flex size-10 items-center justify-center text-slate-400" onClick={() => setModal(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2 className="flex-1 pr-10 text-center text-lg font-bold leading-tight tracking-tight text-slate-100">7日记忆留存趋势说明</h2>
            </div>
            <div className="max-h-[60vh] flex-1 space-y-8 overflow-y-auto px-6 py-4">
              <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#ec5b13]/20 to-transparent">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ec5b13 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <span className="material-symbols-outlined text-5xl text-[#ec5b13]">trending_up</span>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1">
                  <div className="h-8 w-1 rounded-full bg-[#ec5b13]/40" />
                  <div className="h-12 w-1 rounded-full bg-[#ec5b13]/60" />
                  <div className="h-16 w-1 rounded-full bg-[#ec5b13]" />
                  <div className="h-10 w-1 rounded-full bg-[#ec5b13]/50" />
                  <div className="h-14 w-1 rounded-full bg-[#ec5b13]/80" />
                </div>
              </div>

              <section className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-[#ec5b13]/10 text-[#ec5b13]">
                    <span className="material-symbols-outlined text-xl">database</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">数据来源</h3>
                </div>
                <p className="pl-11 text-sm leading-relaxed text-slate-400">
                  系统会根据您每日的复习结果，自动汇总并计算每日的平均记忆留存分数。这包含了您对笔记的熟悉度、答题准确率以及反应时间等多维度数据。
                </p>
              </section>

              <section className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-[#ec5b13]/10 text-[#ec5b13]">
                    <span className="material-symbols-outlined text-xl">insights</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">平滑曲线</h3>
                </div>
                <p className="pl-11 text-sm leading-relaxed text-slate-400">
                  为了更直观地展示长期趋势，我们采用了移动平均算法处理数据波动。平滑后的曲线能够更准确地反映您整体的记忆健康状况，排除单一笔记难度带来的偶然干扰。
                </p>
              </section>

              <section className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-[#ec5b13]/10 text-[#ec5b13]">
                    <span className="material-symbols-outlined text-xl">auto_graph</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">预测功能</h3>
                </div>
                <p className="pl-11 text-sm leading-relaxed text-slate-400">
                  基于艾宾浩斯遗忘曲线模型和您的历史复习习惯，AI 会预测未来 3 天的留存率走势。这能帮助您在记忆滑坡前，及时调整学习节奏。
                </p>
              </section>
            </div>
            <div className="p-6 pt-2">
              <button
                className="h-14 w-full rounded-xl bg-[#ec5b13] font-bold text-white transition-transform active:scale-95"
                onClick={() => setModal(null)}
              >
                我知道了
              </button>
              <div className="h-4" />
            </div>
          </div>
        </div>
      )}

      {modal === 'algorithm' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div
            className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center p-8 pb-4 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="material-symbols-outlined text-4xl text-primary">psychology</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100">记忆留存率算法说明</h3>
            </div>

            <div className="space-y-6 px-8 py-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 shrink-0">
                  <span className="material-symbols-outlined text-primary">science</span>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-slate-100">科学依据</p>
                  <p className="text-sm leading-relaxed text-slate-400">基于赫尔曼·艾宾浩斯遗忘曲线模型，通过数学模拟人类记忆衰减过程。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 shrink-0">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-slate-100">计算逻辑</p>
                  <p className="text-sm leading-relaxed text-slate-400">综合考虑笔记的创建时间、复习次数以及最近一次复习的反馈强度进行实时动态评估。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 shrink-0">
                  <span className="material-symbols-outlined text-primary">track_changes</span>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-slate-100">留存目标</p>
                  <p className="text-sm leading-relaxed text-slate-400">
                    通过科学复习提醒，帮助您将核心知识的长期记忆留存率维持在 <span className="font-bold text-primary">80%</span> 以上。
                  </p>
                </div>
              </div>

              <div className="mt-2 rounded-lg bg-slate-800/50 p-4">
                <div className="flex h-16 w-full items-end justify-between px-2">
                  <div className="h-full w-2 rounded-full bg-primary" />
                  <div className="h-4/5 w-2 rounded-full bg-primary/80" />
                  <div className="h-3/5 w-2 rounded-full bg-primary/60" />
                  <div className="h-2/5 w-2 rounded-full bg-primary/40" />
                  <div className="h-1/4 w-2 rounded-full bg-primary/20" />
                  <div className="h-1/5 w-2 rounded-full bg-primary/10" />
                  <div className="h-[10%] w-2 rounded-full bg-primary/5" />
                </div>
                <div className="mt-2 flex justify-between px-1">
                  <span className="text-[10px] text-slate-500">立即</span>
                  <span className="text-[10px] text-slate-500">20分钟</span>
                  <span className="text-[10px] text-slate-500">1小时</span>
                  <span className="text-[10px] text-slate-500">1天</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-2">
              <button
                className="w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-colors duration-200 hover:bg-primary/90"
                onClick={() => setModal(null)}
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
