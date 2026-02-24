import { useEffect, useRef } from 'react'

const isDev = import.meta.env.DEV

export default function AdUnit({ slot, format = 'auto', className = '' }) {
  const adRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (isDev || pushed.current) return
    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({})
        pushed.current = true
      }
    } catch {
      // AdSense not loaded
    }
  }, [])

  if (isDev) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-800/50 border border-dashed border-slate-600 rounded-lg text-xs text-slate-500 ${className}`}
        style={{ minHeight: 250 }}
      >
        AD Placeholder (300x250)
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT || ''}
        data-ad-slot={slot || import.meta.env.VITE_ADSENSE_SLOT || ''}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
