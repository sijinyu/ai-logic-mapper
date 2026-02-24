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

export default function EditNodeDialog({ node, open, onClose, onSave }) {
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (node) {
      setLabel(node.data?.label || '')
      setDescription(node.data?.description || '')
    }
  }, [node])

  const handleSave = () => {
    onSave(node.id, { label: label.trim(), description: description.trim() })
    onClose()
  }

  if (!node) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[400px] bg-slate-900 border-border">
        <DialogHeader>
          <DialogTitle className="text-slate-100">노드 편집</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="node-label" className="text-slate-300">
              이름
            </Label>
            <Input
              id="node-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-slate-800 border-border text-slate-100"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="node-desc" className="text-slate-300">
              설명
            </Label>
            <Input
              id="node-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800 border-border text-slate-100"
              placeholder="선택사항"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-slate-400">
            취소
          </Button>
          <Button onClick={handleSave} disabled={!label.trim()}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
