import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Bug, Plus, Trash, Check, X, Circle, ListBullets, CheckCircle, Confetti } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Toaster, toast } from 'sonner'

type Task = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

type BugId = 
  | 'add-empty-task'
  | 'delete-wrong-task'
  | 'counter-off-by-one'
  | 'filter-not-working'
  | 'complete-toggle-backwards'
  | 'duplicate-tasks'
  | 'clear-all-clears-active'
  | 'task-order-reversed'
  | 'progress-over-100'
  | 'search-case-sensitive'

const BUGS: Record<BugId, { title: string; description: string; hint: string }> = {
  'add-empty-task': {
    title: 'Empty Task Creation',
    description: 'You can add tasks with no text',
    hint: 'Try adding a task without typing anything'
  },
  'delete-wrong-task': {
    title: 'Delete Wrong Task',
    description: 'Clicking delete removes the wrong task',
    hint: 'Try deleting the second task in a list of 3+'
  },
  'counter-off-by-one': {
    title: 'Task Counter Wrong',
    description: 'The active task counter is always off by one',
    hint: 'Check the active task count vs actual active tasks'
  },
  'filter-not-working': {
    title: 'Completed Filter Broken',
    description: 'The Completed filter shows active tasks instead',
    hint: 'Switch to the Completed tab and see what shows'
  },
  'complete-toggle-backwards': {
    title: 'Toggle Works Backwards',
    description: 'Checking a task marks it as incomplete, unchecking completes it',
    hint: 'Try checking and unchecking tasks'
  },
  'duplicate-tasks': {
    title: 'Duplicate Task Bug',
    description: 'Adding a task creates it twice',
    hint: 'Add a task and count how many appear'
  },
  'clear-all-clears-active': {
    title: 'Clear Completed Deletes Active',
    description: 'Clear Completed button deletes active tasks instead',
    hint: 'Try using the Clear Completed button'
  },
  'task-order-reversed': {
    title: 'Tasks Added in Reverse',
    description: 'New tasks appear at the bottom instead of top',
    hint: 'Add multiple tasks and watch where they appear'
  },
  'progress-over-100': {
    title: 'Progress Bar Over 100%',
    description: 'Progress bar can show more than 100%',
    hint: 'Complete all tasks and check the progress bar'
  },
  'search-case-sensitive': {
    title: 'Search Case Sensitive',
    description: 'Search only works with exact case matching',
    hint: 'Try searching for tasks with different capitalization'
  }
}

function App() {
  const [tasks, setTasks] = useKV<Task[]>('bug-hunt-tasks', [])
  const [foundBugs, setFoundBugs] = useKV<BugId[]>('bug-hunt-found', [])
  const [newTaskText, setNewTaskText] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [selectedBugReport, setSelectedBugReport] = useState<BugId | ''>('')
  const [shakeInput, setShakeInput] = useState(false)

  const addTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      createdAt: Date.now()
    }
    
    setTasks(current => [...(current || []), task, task])
    setNewTaskText('')
  }

  const deleteTask = (id: string) => {
    setTasks(current => {
      const taskList = current || []
      const index = taskList.findIndex(t => t.id === id)
      if (index === -1) return taskList
      const wrongIndex = index === 0 ? 0 : index - 1
      return taskList.filter((_, i) => i !== wrongIndex)
    })
  }

  const toggleTask = (id: string) => {
    setTasks(current => 
      (current || []).map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    )
  }

  const clearCompleted = () => {
    setTasks(current => (current || []).filter(t => t.completed))
  }

  const taskList = tasks || []
  const bugList = foundBugs || []

  const filteredTasks = taskList.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return !task.completed
    return true
  }).filter(task => {
    if (!searchQuery) return true
    return task.text.includes(searchQuery)
  })

  const activeTasks = taskList.filter(t => !t.completed)
  const activeCount = activeTasks.length + 1
  const completedCount = taskList.filter(t => t.completed).length
  const progress = taskList.length > 0 ? (completedCount / taskList.length) * 120 : 0

  const handleBugReport = (bugId: BugId) => {
    if (bugList.includes(bugId)) {
      toast.error('You already found this bug!')
      return
    }

    setFoundBugs(current => [...(current || []), bugId])
    toast.success(`Bug found! ${BUGS[bugId].title}`, {
      description: BUGS[bugId].description
    })
    setReportDialogOpen(false)
    setSelectedBugReport('')
  }

  const resetChallenge = () => {
    setFoundBugs([])
    setTasks([])
    toast.success('Challenge reset!')
  }

  useEffect(() => {
    if (bugList.length === 10) {
      toast.success('🎉 Congratulations! You found all 10 bugs!', {
        duration: 5000
      })
    }
  }, [bugList.length])

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bug size={48} weight="duotone" className="text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Bug Hunter Challenge</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-4">
            This task manager has <span className="font-bold text-accent">10 functional bugs</span> hidden in it. Can you find them all?
          </p>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-1">Bugs Found</p>
                  <p className="text-3xl font-bold text-primary">{bugList.length} / 10</p>
                </div>
                <div className="flex-1 mx-8">
                  <Progress value={(bugList.length / 10) * 100} className="h-3" />
                </div>
                <Button 
                  onClick={() => setReportDialogOpen(true)} 
                  className="animate-pulse-glow"
                  size="lg"
                >
                  <Bug className="mr-2" weight="bold" />
                  Report a Bug
                </Button>
              </div>
              
              {bugList.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {bugList.map(bugId => (
                    <Badge key={bugId} variant="secondary" className="bg-success text-success-foreground">
                      <Check className="mr-1" size={14} weight="bold" />
                      {BUGS[bugId].title}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Manager</CardTitle>
            <CardDescription>
              Use this task manager to discover the bugs. Try all the features!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-2">
                <Input
                  id="new-task-input"
                  placeholder="Add a new task..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  className={shakeInput ? 'animate-shake' : ''}
                  onAnimationEnd={() => setShakeInput(false)}
                />
                <Button onClick={addTask}>
                  <Plus weight="bold" />
                  Add
                </Button>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {activeCount} active {activeCount === 1 ? 'task' : 'tasks'}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearCompleted}
                  disabled={completedCount === 0}
                >
                  Clear Completed
                </Button>
              </div>

              <Progress value={progress} className="h-2" />

              <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    <ListBullets className="mr-2" />
                    All
                  </TabsTrigger>
                  <TabsTrigger value="active" className="flex-1">
                    <Circle className="mr-2" />
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1">
                    <CheckCircle className="mr-2" weight="fill" />
                    Completed
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-4">
                  <div className="space-y-2">
                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No tasks to show
                      </div>
                    ) : (
                      filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-secondary/50 transition-colors"
                        >
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="flex-shrink-0"
                          >
                            {task.completed ? (
                              <Circle size={20} className="text-muted-foreground" />
                            ) : (
                              <CheckCircle size={20} weight="fill" className="text-success" />
                            )}
                          </button>
                          <span className={`flex-1 ${task.completed ? '' : 'line-through text-muted-foreground'}`}>
                            {task.text}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash size={16} className="text-destructive" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {bugList.length === 10 && (
          <Card className="mt-6 border-success bg-success/10">
            <CardContent className="pt-6 text-center">
              <div className="mb-4">
                <Confetti size={64} weight="duotone" className="text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-success mb-2">
                  🎉 Challenge Complete! 🎉
                </h2>
                <p className="text-muted-foreground">
                  You found all 10 bugs! Want to try again?
                </p>
              </div>
              <Button onClick={resetChallenge} variant="outline">
                Reset Challenge
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Report a Bug</DialogTitle>
              <DialogDescription>
                Select the bug you found from the list below
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {(Object.keys(BUGS) as BugId[]).map((bugId) => {
                const bug = BUGS[bugId]
                const found = bugList.includes(bugId)
                
                return (
                  <Card 
                    key={bugId}
                    className={`cursor-pointer transition-all ${
                      found 
                        ? 'opacity-50 bg-success/10 border-success' 
                        : 'hover:border-primary hover:shadow-md'
                    }`}
                    onClick={() => !found && handleBugReport(bugId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1 flex items-center gap-2">
                            {bug.title}
                            {found && <Badge variant="secondary" className="bg-success text-success-foreground">Found!</Badge>}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {bug.description}
                          </p>
                          {!found && bugList.length >= 3 && (
                            <p className="text-xs text-muted-foreground italic">
                              💡 Hint: {bug.hint}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default App
