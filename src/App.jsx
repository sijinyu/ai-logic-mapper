import { TooltipProvider } from '@/components/ui/tooltip'

function App() {
  return (
    <TooltipProvider>
      <div className="h-screen w-screen bg-background text-foreground">
        <h1 className="text-2xl font-bold p-8">AI Logic Mapper</h1>
        <p className="px-8 text-muted-foreground">Setup complete. Ready to build.</p>
      </div>
    </TooltipProvider>
  )
}

export default App
