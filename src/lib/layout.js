import dagre from '@dagrejs/dagre'

const NODE_WIDTH = 250
const NODE_HEIGHT = 80

export function applyAutoLayout(rawNodes, rawEdges, options = {}) {
  const { direction = 'TB', nodeWidth = NODE_WIDTH, nodeHeight = NODE_HEIGHT } = options

  const g = new dagre.graphlib.Graph()
  g.setGraph({
    rankdir: direction,
    nodesep: 60,
    ranksep: 100,
    marginx: 40,
    marginy: 40,
  })
  g.setDefaultEdgeLabel(() => ({}))

  for (const node of rawNodes) {
    g.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  }

  for (const edge of rawEdges) {
    g.setEdge(edge.source, edge.target)
  }

  dagre.layout(g)

  const nodes = rawNodes.map((node) => {
    const pos = g.node(node.id)
    return {
      ...node,
      position: {
        x: pos.x - nodeWidth / 2,
        y: pos.y - nodeHeight / 2,
      },
    }
  })

  return { nodes, edges: rawEdges }
}

export function toReactFlowElements(data) {
  const nodes = data.nodes.map((node) => ({
    id: node.id,
    type: 'custom',
    data: {
      label: node.label,
      nodeType: node.type,
      description: node.description || '',
    },
    position: node.position || { x: 0, y: 0 },
  }))

  const edges = data.edges.map((edge, index) => ({
    id: `e-${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    label: edge.label || '',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    labelStyle: { fill: '#94a3b8', fontSize: 12, fontWeight: 500 },
    labelBgStyle: { fill: '#0f172a', fillOpacity: 0.8 },
  }))

  return { nodes, edges }
}
