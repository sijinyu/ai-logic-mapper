const MERMAID_NODE_MAP = {
  start: (id, label) => `${id}(["${label}"])`,
  process: (id, label) => `${id}["${label}"]`,
  decision: (id, label) => `${id}{"${label}"}`,
  end: (id, label) => `${id}(("${label}"))`,
}

export function toMermaid(nodes, edges) {
  if (!nodes.length) return ''

  const lines = ['graph TD']

  for (const node of nodes) {
    const type = node.data?.nodeType || 'process'
    const label = (node.data?.label || node.id).replace(/"/g, "'")
    const formatter = MERMAID_NODE_MAP[type] || MERMAID_NODE_MAP.process
    lines.push(`  ${formatter(node.id, label)}`)
  }

  for (const edge of edges) {
    const label = (edge.label || '').replace(/"/g, "'")
    if (label) {
      lines.push(`  ${edge.source} -->|"${label}"| ${edge.target}`)
    } else {
      lines.push(`  ${edge.source} --> ${edge.target}`)
    }
  }

  return lines.join('\n')
}

export function exportFlowchartJSON(nodes, edges) {
  return JSON.stringify(
    {
      meta: {
        app: 'AI Logic Mapper',
        version: '1.0',
        exportedAt: new Date().toISOString(),
      },
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.data?.nodeType || 'process',
        label: node.data?.label || '',
        description: node.data?.description || '',
      })),
      edges: edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
        label: edge.label || '',
      })),
    },
    null,
    2
  )
}
