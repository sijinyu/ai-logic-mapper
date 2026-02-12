const STORAGE_KEY = 'ai-logic-mapper-history'
const MAX_HISTORY = 50

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHistory(item) {
  const history = getHistory()
  const newHistory = [
    {
      ...item,
      id: item.id || crypto.randomUUID(),
      timestamp: item.timestamp || Date.now(),
    },
    ...history,
  ].slice(0, MAX_HISTORY)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  } catch {
    // quota exceeded - remove oldest items and retry
    const trimmed = newHistory.slice(0, Math.floor(MAX_HISTORY / 2))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  }

  return newHistory
}

export function deleteHistoryItem(id) {
  const history = getHistory()
  const filtered = history.filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return filtered
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
  return []
}
