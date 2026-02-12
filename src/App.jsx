import { useState, useCallback, useEffect } from 'react'
import { useNodesState, useEdgesState } from 'reactflow'
import { TooltipProvider } from '@/components/ui/tooltip'
import Sidebar from '@/components/sidebar/Sidebar'
import FlowCanvas from '@/components/canvas/FlowCanvas'
import { generateFlowchart, generateFlowchartFromFile } from '@/lib/gemini'
import { applyAutoLayout, toReactFlowElements } from '@/lib/layout'
import { getHistory, saveHistory, deleteHistoryItem } from '@/lib/storage'

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleGenerate = useCallback(async (input, file) => {
    setIsLoading(true)
    try {
      // Call Gemini API
      const rawData = file
        ? await generateFlowchartFromFile(file)
        : await generateFlowchart(input)

      // Convert to React Flow format
      const { nodes: rfNodes, edges: rfEdges } = toReactFlowElements(rawData)

      // Apply auto-layout
      const { nodes: layoutedNodes, edges: layoutedEdges } = applyAutoLayout(
        rfNodes,
        rfEdges
      )

      // Update canvas
      setNodes(layoutedNodes)
      setEdges(layoutedEdges)

      // Save to history
      const historyItem = {
        input: input || file?.name || '',
        label: input?.slice(0, 40) || file?.name || '파일 업로드',
        nodes: layoutedNodes,
        edges: layoutedEdges,
      }
      const updatedHistory = saveHistory(historyItem)
      setHistory(updatedHistory)
    } finally {
      setIsLoading(false)
    }
  }, [setNodes, setEdges])

  const handleHistorySelect = useCallback(
    (item) => {
      if (item.nodes && item.edges) {
        setNodes(item.nodes)
        setEdges(item.edges)
      }
    },
    [setNodes, setEdges]
  )

  const handleHistoryDelete = useCallback((id) => {
    const updated = deleteHistoryItem(id)
    setHistory(updated)
  }, [])

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <Sidebar
          onGenerate={handleGenerate}
          history={history}
          onHistorySelect={handleHistorySelect}
          onHistoryDelete={handleHistoryDelete}
          isLoading={isLoading}
        />
        <main className="flex-1 h-full">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
          />
        </main>
      </div>
    </TooltipProvider>
  )
}

export default App
