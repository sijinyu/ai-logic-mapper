import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { getUserApiKey, setUserApiKey, isUsingUserKey } from '@/lib/gemini'

export default function ApiKeyDialog({ open, onClose }) {
  const [key, setKey] = useState('')
  const [usingOwn, setUsingOwn] = useState(false)

  useEffect(() => {
    if (open) {
      setKey(getUserApiKey())
      setUsingOwn(isUsingUserKey())
    }
  }, [open])

  const handleSave = () => {
    setUserApiKey(key.trim())
    onClose()
  }

  const handleReset = () => {
    setUserApiKey('')
    setKey('')
    setUsingOwn(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[420px] bg-slate-900 border-border">
        <DialogHeader>
          <DialogTitle className="text-slate-100">API 키 설정</DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            Google Gemini API 키를 입력하면 자체 할당량을 사용합니다.
            {!usingOwn && ' 현재 기본 키를 사용 중입니다 (분당 5회 제한).'}
            {usingOwn && ' 현재 내 키를 사용 중입니다 (제한 없음).'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="api-key" className="text-slate-300">
              Gemini API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-slate-800 border-border text-slate-100 font-mono text-sm"
              placeholder="AIzaSy..."
              autoFocus
            />
          </div>
          <p className="text-xs text-slate-500">
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Google AI Studio
            </a>
            에서 무료로 발급받을 수 있습니다. 키는 브라우저에만 저장됩니다.
          </p>
        </div>
        <DialogFooter className="flex gap-2">
          {usingOwn && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="text-slate-400 border-border mr-auto"
            >
              기본 키로 전환
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="text-slate-400">
            취소
          </Button>
          <Button onClick={handleSave} disabled={!key.trim()}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
