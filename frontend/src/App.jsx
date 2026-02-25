import { useState } from 'react'
import './App.css'
import LessonPlan from './components/LessonPlan'
import StudentRecord from './components/StudentRecord'

const tabs = [
  { id: 'lesson', label: '指導案設計AI', icon: '📝' },
  { id: 'record', label: '要録参考AI', icon: '📋' },
]

function App() {
  const [activeTab, setActiveTab] = useState('lesson')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-900/20">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm border border-white/30 shadow-inner">
              📚
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">TeacherAssist AI</h1>
              <p className="text-blue-100 text-xs sm:text-sm mt-0.5 font-medium">教師の業務を支援するAIツール</p>
            </div>
          </div>
        </div>
      </header>

      {/* Description */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base shrink-0">📝</div>
              <div>
                <p className="text-xs font-bold text-gray-700">指導案設計AI</p>
                <p className="text-xs text-gray-500 mt-0.5">教科・単元・学年を入力するだけで、略案・細案を自動生成します</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-base shrink-0">📋</div>
              <div>
                <p className="text-xs font-bold text-gray-700">要録参考AI</p>
                <p className="text-xs text-gray-500 mt-0.5">生徒の様子をチェックするだけで、所見文を3パターン生成します</p>
              </div>
            </div>
          </div>
          <div className="shrink-0 hidden sm:flex items-center gap-1.5 text-xs text-gray-400 border-l border-gray-100 pl-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Gemini 2.0 Flash
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'lesson' ? <LessonPlan /> : <StudentRecord />}
      </main>
    </div>
  )
}

export default App
