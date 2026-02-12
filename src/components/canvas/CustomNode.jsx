import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Play, Cog, GitBranch, Square } from 'lucide-react'

const nodeConfig = {
  start: {
    icon: Play,
    borderColor: 'border-emerald-500/60',
    iconColor: 'text-emerald-400',
    bgGlow: 'shadow-emerald-500/10',
  },
  process: {
    icon: Cog,
    borderColor: 'border-blue-500/60',
    iconColor: 'text-blue-400',
    bgGlow: 'shadow-blue-500/10',
  },
  decision: {
    icon: GitBranch,
    borderColor: 'border-amber-500/60',
    iconColor: 'text-amber-400',
    bgGlow: 'shadow-amber-500/10',
  },
  end: {
    icon: Square,
    borderColor: 'border-red-500/60',
    iconColor: 'text-red-400',
    bgGlow: 'shadow-red-500/10',
  },
}

function CustomNode({ data, selected }) {
  const config = nodeConfig[data.nodeType] || nodeConfig.process
  const Icon = config.icon

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-500 !border-slate-400 hover:!bg-blue-400 transition-colors"
      />

      <Card
        className={cn(
          'min-w-[200px] max-w-[280px] border bg-slate-800/90 backdrop-blur-sm',
          'transition-all duration-200 ease-out cursor-pointer',
          'hover:scale-[1.02] hover:shadow-lg',
          config.borderColor,
          config.bgGlow,
          selected && 'ring-2 ring-blue-500/50 shadow-xl shadow-blue-500/20 scale-[1.02]'
        )}
      >
        <div className="flex items-start gap-3 px-4 py-3">
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-md bg-slate-700/80 shrink-0 mt-0.5',
              config.iconColor
            )}
          >
            <Icon size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-100 leading-tight truncate">
              {data.label}
            </p>
            {data.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {data.description}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-500 !border-slate-400 hover:!bg-blue-400 transition-colors"
      />

      {data.nodeType === 'decision' && (
        <>
          <Handle
            type="source"
            position={Position.Left}
            id="left"
            className="!w-3 !h-3 !bg-slate-500 !border-slate-400 hover:!bg-amber-400 transition-colors"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            className="!w-3 !h-3 !bg-slate-500 !border-slate-400 hover:!bg-amber-400 transition-colors"
          />
        </>
      )}
    </div>
  )
}

export default memo(CustomNode)
