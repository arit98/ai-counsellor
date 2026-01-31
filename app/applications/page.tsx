'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Check, CheckCircle, FileText, MapPin, Plus, Lock } from 'lucide-react'
import { DashboardShell } from '@/components/DashboardShell'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useCopilotReadable } from "@copilotkit/react-core"

// Types
interface LockedUniversity {
  id: string
  name: string
  location: string
  image?: string
}

interface ApplicationTask {
  id: string
  text: string
  universityName: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

interface ChecklistItem {
  id: string
  label: string
  required: boolean
  completed: boolean
}

// Mock Data for Checklist
const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: '1', label: 'Academic Transcripts', required: true, completed: false },
  { id: '2', label: 'Degree Certificate / Diploma', required: true, completed: false },
  { id: '3', label: 'Valid Passport Copy', required: true, completed: false },
  { id: '4', label: 'Statement of Purpose (SOP)', required: true, completed: false },
  { id: '5', label: 'Letters of Recommendation (2-3)', required: true, completed: false },
  { id: '6', label: 'Resume / CV', required: true, completed: false },
  { id: '7', label: 'IELTS/TOEFL Score Report', required: true, completed: false },
  { id: '8', label: 'GRE/GMAT Score Report', required: false, completed: false },
  { id: '9', label: 'Portfolio (if applicable)', required: false, completed: false },
  { id: '10', label: 'Financial Documents', required: true, completed: false },
]

// Mock Data for Tasks (Initial, can be dynamic)
const INITIAL_TASKS: ApplicationTask[] = [
  { id: '1', text: 'Prepare SOP for Massachusetts Institute of Technology', universityName: 'Write a tailored Statement of Purpose for Massachusetts Institute of Technology', priority: 'high', completed: false },
  { id: '2', text: 'Gather documents for Massachusetts Institute of Technology', universityName: 'Transcripts, recommendations, test scores', priority: 'high', completed: false },
  { id: '3', text: 'Prepare SOP for Imperial College London', universityName: 'Write a tailored Statement of Purpose for Imperial College London', priority: 'high', completed: false },
  { id: '4', text: 'Gather documents for Imperial College London', universityName: 'Transcripts, recommendations, test scores', priority: 'high', completed: false },
  { id: '5', text: 'Prepare SOP for University of Toronto', universityName: 'Write a tailored Statement of Purpose for University of Toronto', priority: 'high', completed: false },
  { id: '6', text: 'Gather documents for University of Toronto', universityName: 'Transcripts, recommendations, test scores', priority: 'high', completed: false },
]

export default function ApplicationsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [lockedUnis, setLockedUnis] = useState<LockedUniversity[]>([])
  const [checklist, setChecklist] = useState<ChecklistItem[]>(CHECKLIST_ITEMS)
  const [appTasks, setAppTasks] = useState<ApplicationTask[]>(INITIAL_TASKS)
  const [isLoading, setIsLoading] = useState(true)

  useCopilotReadable({
    description: "The application progress, checklist, and tasks",
    value: {
      lockedUniversities: lockedUnis,
      checklist: checklist,
      tasks: appTasks
    }
  })

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      await fetchProfile()

      // Fetch Locked Universities from LocalStorage (mimicking real data source)
      const lockedIDs = JSON.parse(localStorage.getItem('lockedUniversities') || '[]')
      // In a real app, we would fetch details for these IDs. 
      // Here, we'll try to reconstruct from MOCK_UNIVERSITIES if available in Universities page context, 
      // but since we are on a different page, we need to re-fetch or use a shared store.
      // For simplicity, we'll use a local mock lookup matching the ones we saw earlier.
      const MOCK_LOOKUP: Record<string, LockedUniversity> = {
        '1': { id: '1', name: 'Massachusetts Institute of Technology', location: 'Cambridge, USA', image: '/assets/mit.jpg' },
        '2': { id: '2', name: 'Stanford University', location: 'Stanford, USA', image: '/assets/stanford.jpg' },
        '3': { id: '3', name: 'University of Toronto', location: 'Toronto, Canada', image: '/assets/toronto.jpg' },
        '4': { id: '4', name: 'University of British Columbia', location: 'Vancouver, Canada', image: '/assets/ubc.jpg' },
        '5': { id: '5', name: 'Imperial College London', location: 'London, UK', image: '/assets/imperial.jpg' },
        '6': { id: '6', name: 'ETH Zurich', location: 'Zurich, Switzerland', image: '/assets/zurich.jpg' },
      }

      const loadedLocked = lockedIDs.map((id: string) => MOCK_LOOKUP[id]).filter(Boolean)
      setLockedUnis(loadedLocked)

      setIsLoading(false)
    }
    init()
  }, [])

  async function fetchProfile() {
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()
      if (data && data._id) setProfile(data)
    } catch (e) {
      console.error(e)
    }
  }

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const toggleAppTask = (id: string) => {
    setAppTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const completedTasksCount = checklist.filter(i => i.completed).length + appTasks.filter(t => t.completed).length
  const totalTasksCount = checklist.length + appTasks.length
  const progressPercentage = Math.round((completedTasksCount / totalTasksCount) * 100)

  if (isLoading) {
    return (
      <DashboardShell title="Application Guidance">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Loading application tracker...</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Application Guidance" profile={profile}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Application Guidance</h2>
            <p className="text-muted-foreground">Your personalized application roadmap</p>
          </div>
          {lockedUnis.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full shadow-sm text-sm font-medium">
              <Lock className="h-3.5 w-3.5 text-primary" />
              {lockedUnis.length} Universities Locked
            </div>
          )}
        </div>

        {/* Progress Bar Card */}
        <Card className="p-8 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Application Progress</h3>
              <p className="text-muted-foreground">{completedTasksCount} of {totalTasksCount} tasks completed</p>
            </div>
            <span className="text-4xl font-black text-primary">{progressPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-blue-200 dark:bg-blue-900/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Locked Universities */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Your Universities</h3>
            </div>
            {lockedUnis.length === 0 ? (
              <Card className="p-6 border-dashed text-center text-muted-foreground">
                <p>No universities locked yet.</p>
                <Button variant="link" className="mt-2" onClick={() => window.location.href = '/locked-universities'}>Go to Locked Universities</Button>
              </Card>
            ) : (
              lockedUnis.map(uni => (
                <Card key={uni.id} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-pink-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm truncate" title={uni.name}>{uni.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {uni.location}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Right Column: Document Checklist */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Document Checklist</h3>
            </div>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {checklist.map(item => (
                  <div key={item.id} className="flex items-start gap-3">
                    <Checkbox
                      id={`check-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                      className="mt-1 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 rounded-full"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`check-${item.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {item.label}
                        {item.required && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800">
                            Required
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Application Tasks Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded-full bg-transparent">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-5 w-5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3 className="font-bold text-lg">Your Application Tasks</h3>
          </div>
          <Card className="divide-y divide-border overflow-hidden">
            {appTasks.map(task => (
              <div
                key={task.id}
                className="p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => toggleAppTask(task.id)}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleAppTask(task.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 rounded-full data-[state=checked]:bg-blue-600 border-blue-600/50"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-semibold text-sm ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {task.text}
                    </p>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600">
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{task.universityName}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Timeline Placeholder */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-5 w-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <h3 className="font-bold text-lg">Application Timeline</h3>
          </div>
          {/* Placeholder for Timeline, possibly a chart or list */}
          <Card className="p-8 text-center text-muted-foreground border-dashed">
            Timeline visualization coming soon...
          </Card>
        </div>

      </div>
    </DashboardShell>
  )
}
