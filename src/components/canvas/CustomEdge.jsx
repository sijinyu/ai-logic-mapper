import { memo } from 'react'
import { getSmoothStepPath, EdgeLabelRenderer, BaseEdge } from 'reactflow'
import { Button } from '@/components/ui/button'
import { Pencil, X } from 'lucide-react'

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  style,
  selected,
  data,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          ...style,
          stroke: selected ? '#8b5cf6' : (style?.stroke || '#3b82f6'),
          strokeWidth: selected ? 3 : (style?.strokeWidth || 2),
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute flex items-center gap-1"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {label && (
            <span className="text-xs font-medium text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-border">
              {label}
            </span>
          )}
          {selected && (
            <div className="flex items-center gap-0.5 ml-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  data?.onEdit?.(id)
                }}
              >
                <Pencil size={10} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  data?.onDelete?.(id)
                }}
              >
                <X size={10} />
              </Button>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(CustomEdge)
