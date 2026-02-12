import { useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import { toPng } from 'html-to-image'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ZoomIn, ZoomOut, Maximize, Download, Loader2 } from 'lucide-react'
import { useState } from 'react'

function ToolbarButton({ icon: Icon, label, onClick, loading }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClick}
          disabled={loading}
          className="text-slate-400 hover:text-slate-100 hover:bg-slate-700/80"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

export default function CanvasToolbar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  const [exporting, setExporting] = useState(false)

  const handleExport = useCallback(async () => {
    const viewport = document.querySelector('.react-flow__viewport')
    if (!viewport) return

    setExporting(true)
    try {
      const dataUrl = await toPng(viewport, {
        backgroundColor: '#020617',
        pixelRatio: 2,
        filter: (node) => {
          // Exclude toolbar and minimap from export
          if (node?.classList?.contains?.('react-flow__panel')) return false
          if (node?.classList?.contains?.('react-flow__minimap')) return false
          if (node?.classList?.contains?.('react-flow__controls')) return false
          return true
        },
      })

      const link = document.createElement('a')
      link.download = `flowchart-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [])

  return (
    <div className="flex flex-col gap-1 bg-slate-900/90 backdrop-blur-sm border border-border rounded-lg p-1.5">
      <ToolbarButton icon={ZoomIn} label="확대" onClick={() => zoomIn({ duration: 200 })} />
      <ToolbarButton icon={ZoomOut} label="축소" onClick={() => zoomOut({ duration: 200 })} />
      <ToolbarButton
        icon={Maximize}
        label="화면 맞춤"
        onClick={() => fitView({ duration: 300, padding: 0.2 })}
      />
      <div className="w-full h-px bg-border my-0.5" />
      <ToolbarButton
        icon={Download}
        label="PNG 저장"
        onClick={handleExport}
        loading={exporting}
      />
    </div>
  )
}
