export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-14">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-indigo-500 animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500">AIが生成中です</p>
      <p className="mt-1 text-xs text-gray-400">しばらくお待ちください...</p>
    </div>
  )
}
