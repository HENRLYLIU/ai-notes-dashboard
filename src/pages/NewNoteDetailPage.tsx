import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createNote, getNewNoteMeta } from '../api/mockServer'
import type { Category } from '../api/types'

export default function NewNoteDetailPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [smartReviewEnabled, setSmartReviewEnabled] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getNewNoteMeta().then((res) => {
      if (!active) return
      setCategories(res.categories)
      setSmartReviewEnabled(res.smartReviewEnabled)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const selectedIds = useMemo(() => categories.filter((c) => c.selected).map((c) => c.id), [categories])

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              selected: !item.selected,
            }
          : item,
      ),
    )
  }

  const handleSave = async () => {
    setSaving(true)
    await createNote({
      title,
      content,
      categoryIds: selectedIds,
      smartReviewEnabled,
    })
    navigate('/')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light text-slate-500 dark:bg-background-dark dark:text-slate-400">
        正在加载编辑器...
      </div>
    )
  }

  return (
    <div className="bg-background-light text-slate-900 antialiased dark:bg-background-dark dark:text-slate-100">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-background-light/80 px-4 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80">
          <button onClick={() => navigate(-1)} className="text-base font-medium text-slate-600 hover:opacity-80 dark:text-slate-400">取消</button>
          <h1 className="text-lg font-bold tracking-tight">新建笔记</h1>
          <button
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-full bg-primary px-5 py-1.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4">
          <section className="space-y-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入标题..."
              className="w-full border-none bg-transparent p-0 text-2xl font-bold placeholder:text-slate-400 focus:ring-0 dark:placeholder:text-slate-600"
            />
          </section>

          <section className="-mx-4 flex items-center gap-1 overflow-x-auto border-y border-slate-200 px-4 py-2 no-scrollbar dark:border-slate-800">
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">format_bold</span>
            </button>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">format_italic</span>
            </button>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">format_list_bulleted</span>
            </button>
            <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <button className="whitespace-nowrap rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              <span className="material-symbols-outlined mr-1 align-middle text-sm">magic_button</span>
              AI 润色
            </button>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">image</span>
            </button>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">mic</span>
            </button>
          </section>

          <section className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="开始输入您的灵感或见解..."
              className="h-64 w-full resize-none border-none bg-transparent p-0 font-display text-base leading-relaxed placeholder:text-slate-400 focus:ring-0 dark:placeholder:text-slate-600"
            />
          </section>

          <section className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">分类标签</label>
                <button className="text-xs font-medium text-primary">管理</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCategory(item.id)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium ${
                      item.selected
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">tag</span>
                    {item.label}
                  </button>
                ))}
                <button className="flex items-center justify-center rounded-full bg-slate-100 p-1.5 text-slate-400 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-xs">add</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">艾宾浩斯智能复习</span>
                  <span className="material-symbols-outlined text-sm text-slate-400">info</span>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    value=""
                    className="peer sr-only"
                    checked={smartReviewEnabled}
                    onChange={(e) => setSmartReviewEnabled(e.target.checked)}
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700" />
                </label>
              </div>
              <p className="text-xs leading-normal text-slate-500 dark:text-slate-400">
                开启后，系统将根据记忆曲线在 1、2、4、7、15 天后自动提醒您复习。
              </p>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-primary shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <span className="material-symbols-outlined text-sm">lightbulb</span>
                智能复习建议
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
