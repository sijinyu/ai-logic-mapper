import { useMemo } from 'react'
import ReactFlow, { ReactFlowProvider } from 'reactflow'
import { Background } from '@reactflow/background'
import { Controls } from '@reactflow/controls'
import { MiniMap } from '@reactflow/minimap'
import 'reactflow/dist/style.css'

import CustomNode from './CustomNode'
import CanvasToolbar from './CanvasToolbar'
import { Workflow } from 'lucide-react'

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#3b82f6', strokeWidth: 2 },
}

function EmptyCanvas() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      <div className="flex flex-col items-center gap-4 text-slate-500">
        <Workflow size={48} strokeWidth={1.5} className="text-slate-600" />
        <div className="text-center">
          <p className="text-lg font-medium text-slate-400">플로우차트가 없습니다</p>
          <p className="text-sm mt-1">좌측에서 비즈니스 로직을 입력하고 생성해보세요</p>
        </div>
      </div>
    </div>
  )
}

function FlowCanvasInner({ nodes, edges, onNodesChange, onEdgesChange }) {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), [])
  const isEmpty = nodes.length === 0

  return (
    <div className="relative w-full h-full bg-slate-950">
      {isEmpty && <EmptyCanvas />}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
        minZoom={0.1}
        maxZoom={2}
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="!bg-slate-900/90 !border-border !rounded-lg !shadow-lg [&>button]:!bg-transparent [&>button]:!border-border [&>button]:!text-slate-400 [&>button:hover]:!text-slate-100 [&>button:hover]:!bg-slate-700/80"
          position="bottom-left"
        />
        <MiniMap
          nodeColor={(node) => {
            const type = node.data?.nodeType
            if (type === 'start') return '#10b981'
            if (type === 'decision') return '#f59e0b'
            if (type === 'end') return '#ef4444'
            return '#3b82f6'
          }}
          maskColor="rgba(0, 0, 0, 0.7)"
          className="!bg-slate-900/90 !border-border !rounded-lg"
          pannable
          zoomable
        />
        <div className="absolute top-4 right-4 z-10">
          <CanvasToolbar />
        </div>
      </ReactFlow>
    </div>
  )
}

export default function FlowCanvas(props) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
