import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function EditEdgeDialog({ edge, open, onClose, onSave }) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (edge) {
      setLabel(edge.label || '')
    }
  }, [edge])

  const handleSave = () => {
    onSave(edge.id, { label: label.trim() })
    onClose()
  }

  if (!edge) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[360px] bg-slate-900 border-border">
        <DialogHeader>
          <DialogTitle className="text-slate-100">엣지 편집</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <Label htmlFor="edge-label" className="text-slate-300">
            라벨
          </Label>
          <Input
            id="edge-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="bg-slate-800 border-border text-slate-100"
            placeholder="예: Yes, No, 성공, 실패"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-slate-400">
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
