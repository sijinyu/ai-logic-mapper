import InputPanel from './InputPanel'
import HistoryList from './HistoryList'
import { Button } from '@/components/ui/button'
import { Workflow, HelpCircle } from 'lucide-react'
import { startTour } from '@/lib/tour'

export default function Sidebar({
  onGenerate,
  history,
  onHistorySelect,
  onHistoryDelete,
  isLoading,
}) {
  return (
    <aside className="flex flex-col w-[380px] h-full bg-slate-900 border-r border-border shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/20">
            <Workflow size={18} className="text-blue-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-slate-100 leading-tight">
              AI Logic Mapper
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5">
              비즈니스 로직을 시각화하세요
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={startTour}
            className="text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 h-8 w-8"
            title="사용 가이드"
          >
            <HelpCircle size={16} />
          </Button>
        </div>
      </div>

      {/* Input Section */}
      <div className="px-5 py-4">
        <InputPanel onGenerate={onGenerate} isLoading={isLoading} />
      </div>

      {/* Divider + History */}
      <div id="tour-history" className="flex-1 flex flex-col min-h-0 border-t border-border">
        <div className="px-5 py-3 flex items-center justify-between">
          <h2 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            최근 기록
          </h2>
          {history.length > 0 && (
            <span className="text-[11px] text-slate-600">{history.length}개</span>
          )}
        </div>
        <div className="flex-1 min-h-0 px-2 pb-4">
          <HistoryList
            history={history}
            onSelect={onHistorySelect}
            onDelete={onHistoryDelete}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border text-center">
        <p className="text-[10px] text-slate-600">
          © 2025 sijinyu@Nhn.com · All rights reserved
        </p>
      </div>
    </aside>
  )
}
