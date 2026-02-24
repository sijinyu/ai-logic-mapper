import { useCallback, useState } from 'react'
import { useReactFlow, getNodesBounds, getViewportForBounds } from 'reactflow'
import { toPng } from 'html-to-image'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Loader2,
  Copy,
  Link,
  Check,
  ImageDown,
  FileJson,
} from 'lucide-react'
import { toMermaid, exportFlowchartJSON } from '@/lib/export'
import { encodeShareData } from '@/lib/share'

function ToolbarButton({ icon: Icon, label, onClick, loading, success }) {
  const DisplayIcon = success ? Check : loading ? Loader2 : Icon

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
          <DisplayIcon
            size={16}
            className={
              success ? 'text-emerald-400' : loading ? 'animate-spin' : ''
            }
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

export default function CanvasToolbar({ nodes = [], edges = [] }) {
  const { zoomIn, zoomOut, fitView, getNodes } = useReactFlow()
  const [exporting, setExporting] = useState(false)
  const [copied, setCopied] = useState(null) // 'mermaid' | 'share' | null

  const handleExportViewport = useCallback(async () => {
    const viewport = document.querySelector('.react-flow__viewport')
    if (!viewport) return

    setExporting(true)
    try {
      const dataUrl = await toPng(viewport, {
        backgroundColor: '#020617',
        pixelRatio: 2,
        filter: (node) => {
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

  const handleExportFullCanvas = useCallback(async () => {
    const currentNodes = getNodes()
    if (!currentNodes.length) return

    setExporting(true)
    try {
      const bounds = getNodesBounds(currentNodes)
      const padding = 80
      const width = bounds.width + padding * 2
      const height = bounds.height + padding * 2

      const viewport = getViewportForBounds(
        bounds,
        width,
        height,
        0.5,
        2,
        padding
      )

      const el = document.querySelector('.react-flow__viewport')
      if (!el) return

      const dataUrl = await toPng(el, {
        backgroundColor: '#020617',
        width,
        height,
        pixelRatio: 2,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
        filter: (node) => {
          if (node?.classList?.contains?.('react-flow__panel')) return false
          if (node?.classList?.contains?.('react-flow__minimap')) return false
          if (node?.classList?.contains?.('react-flow__controls')) return false
          return true
        },
      })

      const link = document.createElement('a')
      link.download = `flowchart-full-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Full export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [getNodes])

  const handleCopyMermaid = useCallback(async () => {
    const code = toMermaid(nodes, edges)
    if (!code) return

    try {
      await navigator.clipboard.writeText(code)
      setCopied('mermaid')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied('mermaid')
      setTimeout(() => setCopied(null), 2000)
    }
  }, [nodes, edges])

  const handleExportJSON = useCallback(() => {
    const json = exportFlowchartJSON(nodes, edges)
    if (!json) return

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `flowchart-${Date.now()}.alm.json`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }, [nodes, edges])

  const handleShareLink = useCallback(async () => {
    const url = encodeShareData(nodes, edges)
    if (!url) {
      alert('공유 링크를 생성할 수 없습니다.\n노드가 10개 이하인 경우만 가능합니다.')
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied('share')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied('share')
      setTimeout(() => setCopied(null), 2000)
    }
  }, [nodes, edges])

  const hasNodes = nodes.length > 0

  return (
    <div className="flex flex-col gap-1 bg-slate-900/90 backdrop-blur-sm border border-border rounded-lg p-1.5">
      <ToolbarButton icon={ZoomIn} label="확대" onClick={() => zoomIn({ duration: 200 })} />
      <ToolbarButton icon={ZoomOut} label="축소" onClick={() => zoomOut({ duration: 200 })} />
      <ToolbarButton
        icon={Maximize}
        label="화면 맞춤"
        onClick={() => fitView({ duration: 300, padding: 0.2 })}
      />
      {hasNodes && (
        <>
          <div className="w-full h-px bg-border my-0.5" />
          <ToolbarButton
            icon={Download}
            label="현재 화면 PNG"
            onClick={handleExportViewport}
            loading={exporting}
          />
          <ToolbarButton
            icon={ImageDown}
            label="전체 캔버스 PNG"
            onClick={handleExportFullCanvas}
            loading={exporting}
          />
          <div className="w-full h-px bg-border my-0.5" />
          <ToolbarButton
            icon={FileJson}
            label="JSON 내보내기 (Claude Code용)"
            onClick={handleExportJSON}
          />
          <ToolbarButton
            icon={Copy}
            label="Mermaid 복사"
            onClick={handleCopyMermaid}
            success={copied === 'mermaid'}
          />
          <ToolbarButton
            icon={Link}
            label="공유 링크 복사"
            onClick={handleShareLink}
            success={copied === 'share'}
          />
        </>
      )}
    </div>
  )
}
