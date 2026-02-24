import { useState } from 'react'
import InputPanel from './InputPanel'
import HistoryList from './HistoryList'
import ApiKeyDialog from './ApiKeyDialog'
import AdUnit from '@/components/ads/AdUnit'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Workflow, HelpCircle, Key, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { startTour } from '@/lib/tour'
import { isUsingUserKey } from '@/lib/gemini'

export default function Sidebar({
  onGenerate,
  history,
  onHistorySelect,
  onHistoryDelete,
  isLoading,
  hasFlowchart,
  activeHistoryId,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [apiKeyOpen, setApiKeyOpen] = useState(false)
  const usingOwn = isUsingUserKey()

  return (
    <aside
      className={`flex flex-col h-full bg-slate-900 border-r border-border shrink-0 transition-all duration-200 ${
        collapsed ? 'w-[52px]' : 'w-[380px]'
      }`}
    >
      {/* Header */}
      <div className="px-2.5 py-4 border-b border-border">
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'gap-2.5'}`}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/20 shrink-0">
            <Workflow size={18} className="text-blue-400" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold text-slate-100 leading-tight">
                AI Logic Mapper
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                비즈니스 로직을 시각화하세요
              </p>
            </div>
          )}
          {!collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setApiKeyOpen(true)}
                  className={`h-8 w-8 shrink-0 ${
                    usingOwn
                      ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <Key size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {usingOwn ? '내 API 키 사용 중' : 'API 키 설정'}
              </TooltipContent>
            </Tooltip>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={startTour}
              className="text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 h-8 w-8 shrink-0"
              title="사용 가이드"
            >
              <HelpCircle size={16} />
            </Button>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed((prev) => !prev)}
                className="text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 h-8 w-8 shrink-0"
              >
                {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {collapsed ? '사이드바 열기' : '사이드바 접기'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Input Section */}
          <div className="px-5 py-4">
            <InputPanel onGenerate={onGenerate} isLoading={isLoading} hasFlowchart={hasFlowchart} />
          </div>

          {/* Divider + History */}
          <div id="tour-history" className="flex-1 flex flex-col min-h-0 border-t border-border">
            <div className="px-5 py-3 flex items-center justify-between">
              <h2 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                최근 기록
              </h2>
              {history.length > 0 && (
                <span className="text-[11px] text-slate-600">{history.length}개</span>
              )}
            </div>
            <div className="flex-1 min-h-0 px-2 pb-4">
              <HistoryList
                history={history}
                activeId={activeHistoryId}
                onSelect={onHistorySelect}
                onDelete={onHistoryDelete}
              />
            </div>
          </div>

          {/* Ad */}
          <div className="px-3 py-2 border-t border-border">
            <AdUnit className="rounded-lg overflow-hidden" />
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-border text-center">
            <p className="text-[10px] text-slate-600">
              © 2025 sijinyu@Nhn.com · All rights reserved
            </p>
          </div>
        </>
      )}

      {collapsed && (
        <div className="flex flex-col items-center gap-2 py-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setApiKeyOpen(true)}
                className={`h-8 w-8 ${
                  usingOwn
                    ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Key size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {usingOwn ? '내 API 키 사용 중' : 'API 키 설정'}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={startTour}
                className="text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 h-8 w-8"
              >
                <HelpCircle size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              사용 가이드
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <ApiKeyDialog open={apiKeyOpen} onClose={() => setApiKeyOpen(false)} />
    </aside>
  )
}
