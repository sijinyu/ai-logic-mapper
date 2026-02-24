import { applyAutoLayout, toReactFlowElements } from '@/lib/layout'

const MAX_NODES_FOR_SHARE = 10

export function encodeShareData(nodes, edges) {
  if (!nodes.length) return null
  if (nodes.length > MAX_NODES_FOR_SHARE) return null

  // Strip position data and unnecessary fields to minimize URL length
  const compact = {
    n: nodes.map((n) => ({
      id: n.id,
      t: n.data?.nodeType || 'process',
      l: n.data?.label || '',
      d: n.data?.description || '',
    })),
    e: edges.map((e) => ({
      s: e.source,
      t: e.target,
      l: e.label || '',
    })),
  }

  try {
    const json = JSON.stringify(compact)
    const encoded = btoa(unescape(encodeURIComponent(json)))
    return `${window.location.origin}${window.location.pathname}#data=${encoded}`
  } catch {
    return null
  }
}

export function decodeShareData() {
  try {
    const hash = window.location.hash
    if (!hash.startsWith('#data=')) return null

    const encoded = hash.slice(6)
    const json = decodeURIComponent(escape(atob(encoded)))
    const compact = JSON.parse(json)

    if (!compact.n || !compact.e) return null

    const rawData = {
      nodes: compact.n.map((n) => ({
        id: n.id,
        label: n.l,
        type: n.t,
        description: n.d,
      })),
      edges: compact.e.map((e) => ({
        source: e.s,
        target: e.t,
        label: e.l,
      })),
    }

    const { nodes, edges } = toReactFlowElements(rawData)
    const layouted = applyAutoLayout(nodes, edges)
    return layouted
  } catch {
    return null
  }
}
