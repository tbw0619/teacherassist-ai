import { useState } from 'react'
import Spinner from './Spinner'
import PatternResults from './PatternResults'

const STRONG_SUBJECTS = [
  '国語', '数学', '英語', '理科', '社会',
  '保健体育', '芸術', '情報', '専門科目', '全般的に意欲的',
]

const STUDY_ATTITUDE = [
  '授業に真剣に取り組んでいる',
  '予習・復習など自主的に学習している',
  '粘り強く課題に取り組む',
  '積極的に発言・質問する',
  '友人と協力して学ぶ姿勢がある',
  '実技・実習に意欲的に取り組む',
  '学期を通じて成長・向上が見られた',
]

const PERSONALITY = [
  '明るく元気がある',
  '責任感が強い',
  '思いやりがある',
  '穏やかで落ち着いている',
  '誠実で真面目',
  '粘り強い',
  '積極的・行動力がある',
  '素直で向上心がある',
]

const SCHOOL_LIFE = [
  '礼儀正しく言動が落ち着いている',
  '時間・規則をよく守る',
  '清掃・当番活動に真剣に取り組む',
  '友人関係が良好で信頼されている',
  '困っている人を自然に助けられる',
  '自分の役割を最後まで果たす',
  '異なる意見も尊重しながら行動できる',
]

const ACHIEVEMENTS = [
  '学校行事でリーダーとして活躍した',
  '縁の下の力持ちとしてチームを支えた',
  '資格・検定・コンクール等で成果を上げた',
  'ボランティアや地域活動に参加した',
  'クラスや学校の雰囲気づくりに貢献した',
  '部活動で顕著な成長・活躍があった',
]

const initialForm = {
  strong_subjects: [],
  study_attitude: [],
  study_note: '',
  personality: [],
  school_life: [],
  behavior_note: '',
  club: '',
  committee: '',
  achievements: [],
  activity_note: '',
  general_note: '',
}

function CheckboxGroup({ label, options, selected, onChange }) {
  const toggle = (item) => {
    onChange(
      selected.includes(item)
        ? selected.filter((s) => s !== item)
        : [...selected, item]
    )
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border cursor-pointer transition-colors select-none ${
              selected.includes(option)
                ? 'bg-blue-100 border-blue-400 text-blue-800'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  )
}

export default function StudentRecord() {
  const [form, setForm] = useState(initialForm)
  const [patterns, setPatterns] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastForm, setLastForm] = useState(null)

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError('')
    setPatterns(null)

    const body = { ...form }
    setLastForm(body)

    try {
      const res = await fetch('/api/student-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'エラーが発生しました')
      }
      const data = await res.json()
      setPatterns(data.patterns)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = () => {
    handleSubmit()
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'

  const sectionClass =
    'bg-white p-5 rounded-lg shadow-sm border border-gray-200 space-y-4'

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 学習の記録 */}
        <div className={sectionClass}>
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <span>📚</span> 学習の記録
          </h3>

          <CheckboxGroup
            label="得意・頑張った教科"
            options={STRONG_SUBJECTS}
            selected={form.strong_subjects}
            onChange={(v) => updateField('strong_subjects', v)}
          />

          <CheckboxGroup
            label="学習への取り組み姿勢"
            options={STUDY_ATTITUDE}
            selected={form.study_attitude}
            onChange={(v) => updateField('study_attitude', v)}
          />

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">学習面の補足（任意）</p>
            <textarea
              value={form.study_note}
              onChange={(e) => updateField('study_note', e.target.value)}
              placeholder="具体的なエピソード・特記事項など"
              rows={2}
              className={inputClass}
            />
          </div>
        </div>

        {/* 行動・生活の記録 */}
        <div className={sectionClass}>
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <span>🤝</span> 行動・生活の記録
          </h3>

          <CheckboxGroup
            label="性格・人柄"
            options={PERSONALITY}
            selected={form.personality}
            onChange={(v) => updateField('personality', v)}
          />

          <CheckboxGroup
            label="学校生活での様子"
            options={SCHOOL_LIFE}
            selected={form.school_life}
            onChange={(v) => updateField('school_life', v)}
          />

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">行動・人柄の補足（任意）</p>
            <textarea
              value={form.behavior_note}
              onChange={(e) => updateField('behavior_note', e.target.value)}
              placeholder="印象的なエピソード・具体的な場面など"
              rows={2}
              className={inputClass}
            />
          </div>
        </div>

        {/* 特別活動・その他 */}
        <div className={sectionClass}>
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <span>🏃</span> 特別活動・その他
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">部活動（任意）</p>
              <input
                value={form.club}
                onChange={(e) => updateField('club', e.target.value)}
                placeholder="例: 野球部・吹奏楽部"
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">委員会・学級での役割（任意）</p>
              <input
                value={form.committee}
                onChange={(e) => updateField('committee', e.target.value)}
                placeholder="例: 学級委員・図書委員"
                className={inputClass}
              />
            </div>
          </div>

          <CheckboxGroup
            label="特記すべき活躍"
            options={ACHIEVEMENTS}
            selected={form.achievements}
            onChange={(v) => updateField('achievements', v)}
          />

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">特別活動の補足（任意）</p>
            <textarea
              value={form.activity_note}
              onChange={(e) => updateField('activity_note', e.target.value)}
              placeholder="大会結果・具体的なエピソードなど"
              rows={2}
              className={inputClass}
            />
          </div>
        </div>

        {/* 総合的な特記事項 */}
        <div className={sectionClass}>
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <span>✏️</span> 総合的な特記事項（任意）
          </h3>
          <textarea
            value={form.general_note}
            onChange={(e) => updateField('general_note', e.target.value)}
            placeholder="上記全体を通じて伝えたいこと"
            rows={3}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer text-base"
        >
          所見文を生成
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {loading && <Spinner />}
      {patterns && (
        <PatternResults
          patterns={patterns}
          onRegenerate={handleRegenerate}
          loading={loading}
        />
      )}
    </div>
  )
}
