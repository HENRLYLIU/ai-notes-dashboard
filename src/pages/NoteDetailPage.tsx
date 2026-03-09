import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getNoteDetail } from '../api/mockServer'
import type { NoteDetailData } from '../api/types'

export default function NoteDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<NoteDetailData | null>(null)

  useEffect(() => {
    let active = true
    getNoteDetail(id).then((res) => {
      if (!active) return
      setData(res)
    })
    return () => {
      active = false
    }
  }, [id])

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light text-slate-500 dark:bg-background-dark dark:text-slate-400">
        正在加载笔记详情...
      </div>
    )
  }

  return (
    <div className="bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100 min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-background-light/80 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80">
        <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="rounded-full p-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">笔记详情</h1>
          <button className="rounded-full p-2 text-slate-400">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h2 className="text-2xl font-bold leading-tight">{data.title}</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{data.memoryRate}% 记忆度</span>
          </div>
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <span>{data.date}</span>
            <span>•</span>
            <span>{data.category}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{data.summary}</p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">正文内容</h3>
          <article className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">{data.content}</article>
        </section>
      </main>
    </div>
  )
}
