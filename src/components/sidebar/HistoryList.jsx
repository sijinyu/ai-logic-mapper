import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Trash2, Clock, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function getRelativeTime(timestamp) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

function HistoryItem({ item, onSelect, onDelete }) {
  const label = item.input?.slice(0, 40) || item.label || '제목 없음'

  return (
    <div
      onClick={() => onSelect(item)}
      className={cn(
        'group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer',
        'transition-colors duration-150',
        'hover:bg-slate-800/60'
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 truncate group-hover:text-slate-100 transition-colors">
          {label}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <Clock size={10} className="text-slate-600" />
          <span className="text-[11px] text-slate-600">
            {getRelativeTime(item.timestamp)}
          </span>
          <span className="text-[11px] text-slate-600">
            · {item.nodes?.length || 0}개 노드
          </span>
        </div>
      </div>

      <ChevronRight
        size={14}
        className="text-slate-600 group-hover:text-slate-400 shrink-0 transition-colors"
      />

      <Button
        variant="ghost"
        size="icon-xs"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(item.id)
        }}
        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 hover:bg-red-500/10 shrink-0 transition-all"
      >
        <Trash2 size={12} />
      </Button>
    </div>
  )
}

export default function HistoryList({ history, onSelect, onDelete }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock size={24} className="text-slate-700 mb-2" />
        <p className="text-xs text-slate-600">아직 생성 기록이 없습니다</p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-0.5 pr-2">
        {history.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
