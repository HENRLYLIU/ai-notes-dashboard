import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLibraryData } from '../api/mockServer'
import type { LibraryData, LibraryNote } from '../api/types'

function memoryColor(rate: number) {
  if (rate >= 90) return 'text-emerald-500'
  if (rate < 70) return 'text-amber-500'
  return 'text-primary'
}

function trendStroke(rate: number) {
  if (rate >= 90) return 'stroke-emerald-500'
  if (rate < 70) return 'stroke-amber-500'
  return 'stroke-primary'
}

function trendPath(note: LibraryNote) {
  if (note.trend === 'up') return 'M0 20 Q 25 10, 50 5 T 100 0'
  if (note.trend === 'down') return 'M0 5 Q 25 25, 50 20 T 100 28'
  return 'M0 25 Q 25 5, 50 15 T 100 10'
}

export default function LibraryPage() {
  const [data, setData] = useState<LibraryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')

  useEffect(() => {
    let active = true
    getLibraryData().then((res) => {
      if (!active) return
      setData(res)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const filteredNotes = useMemo(() => {
    if (!data) return []
    return data.notes.filter((note) => {
      const categoryOk = activeCategory === '全部' || note.category === activeCategory
      const keyword = search.trim().toLowerCase()
      const searchOk =
        keyword.length === 0 ||
        note.title.toLowerCase().includes(keyword) ||
        note.summary.toLowerCase().includes(keyword) ||
        note.category.toLowerCase().includes(keyword)
      return categoryOk && searchOk
    })
  }, [data, activeCategory, search])

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light text-slate-500 dark:bg-background-dark dark:text-slate-400">
        正在加载笔记库...
      </div>
    )
  }

  return (
    <div className="bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background-light/80 px-4 pb-2 pt-6 backdrop-blur-md dark:bg-background-dark/80">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 overflow-hidden rounded-full border border-primary/30 bg-primary/20">
              <img
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrsXk5SjT2i4iqvXnGTwKgpswQUGoZPUSO2z4w8jxu8FPpEf9Abq9Rsalm80AQc8jUqamLJs_mQHTsdg2uFZi5mDU1XyLSRXYyFMJjOejcNuLH0hRRXV_KSxMN_axnGVpIBF_Nr6JObbqEoGhOvGEDNufrJkuMVL6epKLXtGmjF0S0TMeIMZJk8tw0HplAGKo5pRmfLrCxWZU7Dczwthv-FddeXJ54qPXJxQLZMLTj75WMCSwgsviopZ77WXPhngRu6Ao_B-PMSg"
                alt="avatar"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight">笔记库</h1>
          </div>
          <button className="rounded-full p-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="搜索笔记、标签或内容"
              className="h-12 w-full rounded-xl border-none bg-slate-200/50 pl-10 pr-4 text-base placeholder:text-slate-500 focus:ring-2 focus:ring-primary dark:bg-slate-800/50"
            />
          </div>
          <button className="flex size-12 items-center justify-center rounded-xl bg-slate-200/50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </header>

      <nav className="px-4 py-3">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {data.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-xl px-5 py-2 font-medium ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-slate-200/50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <main className="mb-24 flex-1 space-y-4 px-4 py-2">
        {filteredNotes.map((note) => (
          <div key={note.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
            <div className="mb-2 flex items-start justify-between">
              <Link to={`/notes/${note.id}`} className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {note.title}
              </Link>
              <div className="flex flex-col items-end">
                <span className={`text-xs font-bold ${memoryColor(note.memoryRate)}`}>{note.memoryRate}% 记忆度</span>
                <div className="mt-1 h-4 w-12 opacity-60">
                  <svg className={`h-full w-full fill-none stroke-2 ${trendStroke(note.memoryRate)}`} viewBox="0 0 100 30">
                    <path d={trendPath(note)} />
                  </svg>
                </div>
              </div>
            </div>
            <p className="mb-4 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{note.summary}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{note.date}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{note.category}</span>
              </div>
              <button className="text-slate-400">
                <span className="material-symbols-outlined text-xl">more_horiz</span>
              </button>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            没有匹配的笔记
          </div>
        )}
      </main>

      <Link to="/notes/new" className="fixed bottom-24 right-6 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40">
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>

      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/95 pb-safe backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex h-20 max-w-md items-center justify-around px-4">
          <Link className="flex flex-1 flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500" to="/">
            <span className="material-symbols-outlined text-[26px]">home</span>
            <span className="text-xs font-normal">主页</span>
          </Link>
          <Link className="flex flex-1 flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500" to="/review">
            <span className="material-symbols-outlined text-[26px]">school</span>
            <span className="text-xs font-normal">复习</span>
          </Link>
          <Link className="fill-1 flex flex-1 flex-col items-center gap-1.5 text-primary" to="/library">
            <span className="material-symbols-outlined text-[26px]">grid_view</span>
            <span className="text-xs font-semibold">库</span>
          </Link>
          <a className="flex flex-1 flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500" href="#">
            <span className="material-symbols-outlined text-[26px]">settings</span>
            <span className="text-xs font-normal">设置</span>
          </a>
        </div>
      </footer>
    </div>
  )
}
