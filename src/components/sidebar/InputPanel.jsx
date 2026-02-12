import { useState, useRef, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2, Upload, X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = [
  'text/plain',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_FILE_SIZE = 5 * 1024 * 1024

export default function InputPanel({ onGenerate, isLoading }) {
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const validateFile = useCallback((f) => {
    if (f.size > MAX_FILE_SIZE) {
      setError('파일 크기는 5MB 이하만 가능합니다.')
      return false
    }
    const isValid =
      ACCEPTED_TYPES.includes(f.type) ||
      f.name.endsWith('.txt') ||
      f.name.endsWith('.pdf') ||
      f.name.endsWith('.docx')
    if (!isValid) {
      setError('.txt, .pdf, .docx 파일만 지원합니다.')
      return false
    }
    setError('')
    return true
  }, [])

  const handleFileChange = useCallback(
    (e) => {
      const f = e.target.files?.[0]
      if (f && validateFile(f)) {
        setFile(f)
      }
    },
    [validateFile]
  )

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragOver(false)
      const f = e.dataTransfer.files?.[0]
      if (f && validateFile(f)) {
        setFile(f)
      }
    },
    [validateFile]
  )

  const handleSubmit = useCallback(async () => {
    if (isLoading) return
    if (!input.trim() && !file) {
      setError('텍스트를 입력하거나 파일을 업로드해주세요.')
      return
    }
    setError('')
    try {
      await onGenerate(input.trim(), file)
      setInput('')
      setFile(null)
    } catch (err) {
      setError(err.message || '생성 중 오류가 발생했습니다.')
    }
  }, [input, file, isLoading, onGenerate])

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="비즈니스 로직을 입력하세요...&#10;&#10;예: 사용자가 로그인 버튼을 클릭하면 이메일과 비밀번호를 검증한다. 검증이 성공하면 대시보드로 이동하고, 실패하면 에러 메시지를 표시한다."
        disabled={isLoading}
        className="min-h-[160px] resize-none bg-slate-800/50 border-border text-sm leading-relaxed placeholder:text-slate-500"
      />

      {/* File Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed cursor-pointer transition-colors',
          'text-xs text-slate-400',
          dragOver
            ? 'border-blue-500/60 bg-blue-500/10 text-blue-400'
            : 'border-border hover:border-slate-600 hover:bg-slate-800/30'
        )}
      >
        {file ? (
          <>
            <FileText size={14} className="text-blue-400 shrink-0" />
            <span className="truncate flex-1 text-slate-300">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFile(null)
              }}
              className="text-slate-500 hover:text-slate-300"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <Upload size={14} className="shrink-0" />
            <span>파일 업로드 (.txt, .pdf, .docx)</span>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-400 px-1">{error}</p>}

      <Button
        onClick={handleSubmit}
        disabled={isLoading || (!input.trim() && !file)}
        className="w-full gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            분석 중...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generate Logic
          </>
        )}
      </Button>

      <p className="text-[11px] text-slate-500 text-center">
        Ctrl + Enter로 빠르게 생성
      </p>
    </div>
  )
}
