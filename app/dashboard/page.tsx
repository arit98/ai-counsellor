'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import {
  MessageSquare,
  Globe,
  CheckSquare,
  User,
  Zap,
  Target,
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import { DashboardShell } from '@/components/DashboardShell'

interface ProfileData {
  firstName: string
  lastName: string
  dateOfBirth: string
  citizenship: string
  currentLevel: string
  gpa: string
  degreeLevel: string
  careerGoals: string
  countryPreferences: string[]
  budgetRange: string
  intendedYear: string
}

import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview')
  const [stats, setStats] = useState({
    recommendations: 0,
    shortlisted: 0,
    applications: 0
  })

  // Provide profile context to Copilot
  useCopilotReadable({
    description: "The user's current academic and personal profile",
    value: profileData,
  })

  // Provide navigation actions to Copilot
  useCopilotAction({
    name: "navigateToTab",
    description: "Navigate to a specific tab in the dashboard",
    parameters: [
      {
        name: "tab",
        type: "string",
        description: "The tab to navigate to (e.g., 'overview', 'profile')",
        required: true,
      },
    ],
    handler: ({ tab }) => {
      setActiveTab(tab)
    },
  })

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [searchParams])

  useEffect(() => {
    const init = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user._id) {
        window.location.href = '/'
        return
      }

      await Promise.all([fetchProfile(user._id), fetchStats(user._id)])
    }
    init()
  }, [])

  async function fetchProfile(userId: string) {
    try {
      const response = await fetch(`/api/profile?userId=${userId}`)
      const data = await response.json()
      if (data && data._id) {
        setProfileData(data)
      } else {
        setProfileData({
          firstName: 'Guest',
          lastName: 'User',
          dateOfBirth: '',
          citizenship: '',
          currentLevel: 'Not set',
          gpa: '0.0',
          degreeLevel: 'Not set',
          careerGoals: 'Please complete your profile to see personalized advice.',
          countryPreferences: [],
          budgetRange: 'Not set',
          intendedYear: 'Not set'
        } as ProfileData)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  async function fetchStats(userId: string) {
    try {
      const savedShortlisted = localStorage.getItem('shortlistedUniversities')
      const savedLocked = localStorage.getItem('lockedUniversities')

      const shortlistedIds: string[] = savedShortlisted ? JSON.parse(savedShortlisted) : []
      const lockedIds: string[] = savedLocked ? JSON.parse(savedLocked) : []

      // Exclude locked universities from shortlisted count (they've moved to applications)
      const shortlistedOnlyIds = shortlistedIds.filter(id => !lockedIds.includes(id))

      setStats({
        recommendations: 0,
        shortlisted: shortlistedOnlyIds.length,
        applications: lockedIds.length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (!profileData) {
    return (
      <DashboardShell title="Dashboard">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative w-14 h-14 border-4 border-violet-500 border-t-cyan-500 rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Dashboard" profile={profileData}>
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Welcome Header */}
            <div>
              <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Your Study Abroad Hub</span>
              </div>
              <h2 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">
                Welcome back{profileData.firstName === 'Guest' ? '' : `, ${profileData.firstName}`}!
                <span className="ml-2">👋</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                {profileData.firstName === 'Guest'
                  ? "Get started by completing your profile to unlock AI-powered recommendations."
                  : "Here's your personalized study abroad journey at a glance"}
              </p>

              {profileData.firstName === 'Guest' && (
                <div className="mt-6 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative p-5 bg-card rounded-2xl border border-violet-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 flex items-center justify-center">
                        <User className="h-6 w-6 text-violet-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Complete Your Profile</p>
                        <p className="text-sm text-muted-foreground">Unlock personalized AI recommendations</p>
                      </div>
                    </div>
                    <Link href="/onboarding">
                      <Button className="relative overflow-hidden rounded-full group/btn">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500" />
                        <span className="relative flex items-center gap-2">
                          Get Started
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'AI Recommendations', value: stats.recommendations.toString(), icon: Zap, gradient: 'from-yellow-500 to-orange-500' },
                { label: 'Shortlisted Unis', value: stats.shortlisted.toString(), icon: Target, gradient: 'from-violet-500 to-purple-500' },
                { label: 'Applications', value: stats.applications.toString(), icon: BookOpen, gradient: 'from-cyan-500 to-blue-500' },
                { label: 'Profile Score', value: '100%', icon: TrendingUp, gradient: 'from-green-500 to-emerald-500' }
              ].map((stat, idx) => (
                <Card key={idx} className="relative group bg-card border-border overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-10`}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                  {/* Hover glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-violet-500 to-cyan-500" />
                Quick Actions
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <Link href="/ai-counsellor" className="group">
                  <div className="relative h-full overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-cyan-600" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
                    <div className="relative p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-white">Chat with AI Counsellor</span>
                      </div>
                      <p className="text-white/80 text-sm flex-1">Get personalized university recommendations based on your profile and goals.</p>
                      <div className="flex items-center gap-2 mt-4 text-white/90 text-sm font-medium group-hover:gap-3 transition-all">
                        Start Chat <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/universities" className="group">
                  <div className="relative h-full overflow-hidden rounded-2xl bg-card border border-border hover:border-violet-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-600/10 to-transparent rounded-full blur-2xl" />
                    <div className="relative p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-violet-500/10 rounded-lg">
                          <Globe className="h-5 w-5 text-violet-400" />
                        </div>
                        <span className="font-bold text-lg text-foreground">Explore Universities</span>
                      </div>
                      <p className="text-muted-foreground text-sm flex-1">Discover global rankings and shortlist your dream universities.</p>
                      <div className="flex items-center gap-2 mt-4 text-violet-400 text-sm font-medium group-hover:gap-3 transition-all">
                        Browse <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/applications" className="group">
                  <div className="relative h-full overflow-hidden rounded-2xl bg-card border border-border hover:border-cyan-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-600/10 to-transparent rounded-full blur-2xl" />
                    <div className="relative p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                          <CheckSquare className="h-5 w-5 text-cyan-400" />
                        </div>
                        <span className="font-bold text-lg text-foreground">Application Tracker</span>
                      </div>
                      <p className="text-muted-foreground text-sm flex-1">Track your application tasks and follow our step-by-step roadmap.</p>
                      <div className="flex items-center gap-2 mt-4 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
                        View Progress <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/profile" className="group">
                  <div className="relative h-full overflow-hidden rounded-2xl bg-card border border-border hover:border-fuchsia-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-fuchsia-600/10 to-transparent rounded-full blur-2xl" />
                    <div className="relative p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-fuchsia-500/10 rounded-lg">
                          <User className="h-5 w-5 text-fuchsia-400" />
                        </div>
                        <span className="font-bold text-lg text-foreground">Update Profile</span>
                      </div>
                      <p className="text-muted-foreground text-sm flex-1">Keep your academic and career goals updated for better AI advice.</p>
                      <div className="flex items-center gap-2 mt-4 text-fuchsia-400 text-sm font-medium group-hover:gap-3 transition-all">
                        Edit Profile <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
