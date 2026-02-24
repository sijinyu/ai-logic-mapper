import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useNodesState, useEdgesState, addEdge, reconnectEdge } from 'reactflow'
import { TooltipProvider } from '@/components/ui/tooltip'
import Sidebar from '@/components/sidebar/Sidebar'
import FlowCanvas from '@/components/canvas/FlowCanvas'
import EditNodeDialog from '@/components/canvas/EditNodeDialog'
import EditEdgeDialog from '@/components/canvas/EditEdgeDialog'
import CustomEdge from '@/components/canvas/CustomEdge'
import { generateFlowchart, generateFlowchartFromFile } from '@/lib/gemini'
import { applyAutoLayout, toReactFlowElements } from '@/lib/layout'
import { getHistory, saveHistory, deleteHistoryItem } from '@/lib/storage'
import { isTourCompleted, startTour } from '@/lib/tour'
import { decodeShareData } from '@/lib/share'

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingNode, setEditingNode] = useState(null)
  const [editingEdge, setEditingEdge] = useState(null)

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory())
  }, [])

  // Load shared flowchart from URL hash
  useEffect(() => {
    const shared = decodeShareData()
    if (shared) {
      setNodes(shared.nodes)
      setEdges(shared.edges)
      // Clean hash from URL
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [setNodes, setEdges])

  // Auto-start tour for first-time visitors
  useEffect(() => {
    if (!isTourCompleted()) {
      const timer = setTimeout(startTour, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Request notification permission on first generate
  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const sendNotification = useCallback((title, body) => {
    if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
      new Notification(title, {
        body,
        icon: '/vite.svg',
      })
    }
  }, [])

  const handleGenerate = useCallback(async (input, file) => {
    setIsLoading(true)
    requestNotificationPermission()
    try {
      const rawData = file
        ? await generateFlowchartFromFile(file)
        : await generateFlowchart(input)

      const { nodes: rfNodes, edges: rfEdges } = toReactFlowElements(rawData)
      const { nodes: layoutedNodes, edges: layoutedEdges } = applyAutoLayout(
        rfNodes,
        rfEdges
      )

      setNodes(layoutedNodes)
      setEdges(layoutedEdges)

      const historyItem = {
        input: input || file?.name || '',
        label: input?.slice(0, 40) || file?.name || '파일 업로드',
        nodes: layoutedNodes,
        edges: layoutedEdges,
      }
      const updatedHistory = saveHistory(historyItem)
      setHistory(updatedHistory)

      sendNotification(
        'AI Logic Mapper',
        `플로우차트 생성 완료 (노드 ${layoutedNodes.length}개)`
      )
    } catch (err) {
      sendNotification('AI Logic Mapper', '플로우차트 생성 실패')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setNodes, setEdges, requestNotificationPermission, sendNotification])

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

  // Node editing
  const handleNodeDoubleClick = useCallback((_event, node) => {
    setEditingNode(node)
  }, [])

  const handleNodeEditSave = useCallback(
    (nodeId, updates) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, ...updates } }
            : n
        )
      )
    },
    [setNodes]
  )

  // Edge editing
  const handleEdgeEdit = useCallback(
    (edgeId) => {
      const edge = edges.find((e) => e.id === edgeId)
      if (edge) setEditingEdge(edge)
    },
    [edges]
  )

  const handleEdgeEditSave = useCallback(
    (edgeId, updates) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId ? { ...e, ...updates } : e
        )
      )
    },
    [setEdges]
  )

  const handleEdgeDelete = useCallback(
    (edgeId) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId))
    },
    [setEdges]
  )

  // Edge reconnect (drag edge endpoint to another node)
  const edgeReconnectSuccessful = useRef(true)

  const handleReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false
  }, [])

  const handleReconnect = useCallback(
    (oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true
      setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds))
    },
    [setEdges]
  )

  const handleReconnectEnd = useCallback(
    (_, edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id))
      }
      edgeReconnectSuccessful.current = true
    },
    [setEdges]
  )

  // Edge connection (drag from handle)
  const handleConnect = useCallback(
    (connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'custom',
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
          },
          eds
        )
      )
    },
    [setEdges]
  )

  // Inject edge callbacks into edge data
  const edgesWithCallbacks = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        type: 'custom',
        data: {
          ...e.data,
          onEdit: handleEdgeEdit,
          onDelete: handleEdgeDelete,
        },
      })),
    [edges, handleEdgeEdit, handleEdgeDelete]
  )

  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), [])

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
        <main id="tour-canvas" className="flex-1 h-full">
          <FlowCanvas
            nodes={nodes}
            edges={edgesWithCallbacks}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDoubleClick={handleNodeDoubleClick}
            onConnect={handleConnect}
            onReconnectStart={handleReconnectStart}
            onReconnect={handleReconnect}
            onReconnectEnd={handleReconnectEnd}
            edgeTypes={edgeTypes}
          />
        </main>
      </div>
      <EditNodeDialog
        node={editingNode}
        open={!!editingNode}
        onClose={() => setEditingNode(null)}
        onSave={handleNodeEditSave}
      />
      <EditEdgeDialog
        edge={editingEdge}
        open={!!editingEdge}
        onClose={() => setEditingEdge(null)}
        onSave={handleEdgeEditSave}
      />
    </TooltipProvider>
  )
}

export default App
