import { useState } from 'react'
import './App.css'
import LessonPlan from './components/LessonPlan'
import StudentRecord from './components/StudentRecord'

const tabs = [
  { id: 'lesson', label: '指導案設計AI' },
  { id: 'record', label: '要録参考AI' },
]

function App() {
  const [activeTab, setActiveTab] = useState('lesson')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold">TeacherAssist AI</h1>
          <p className="text-blue-100 text-sm mt-1">教師の業務を支援するAIツール</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
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
