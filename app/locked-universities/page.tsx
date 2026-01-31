'use client'

import React, { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/DashboardShell'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Lock,
    Star,
    Target,
    MapPin,
    TrendingUp,
    CheckCircle2,
    Check
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useCopilotReadable } from "@copilotkit/react-core"

// Duplicated from universities/page.tsx for simplicity in this task
interface University {
    id: string
    name: string
    location: string
    country: string
    ranking: number
    tuitionRange: string
    tuition: number
    admissionRate: number
    studentsCount: number
    programs: string[]
    matchScore: number
    category: 'Dream' | 'Target' | 'Reach' | 'Safety'
    website: string
    image?: string
}

const MOCK_UNIVERSITIES: University[] = [
    {
        id: '1',
        name: 'Massachusetts Institute of Technology',
        location: 'Cambridge, USA',
        country: 'USA',
        ranking: 1,
        tuitionRange: '$55,000 - $60,000/year',
        tuition: 58000,
        admissionRate: 4,
        studentsCount: 11500,
        programs: ['Computer Science', 'Engineering', 'Data Science'],
        matchScore: 85,
        category: 'Dream',
        website: 'https://mit.edu',
        image: '/assets/mit.jpg'
    },
    {
        id: '2',
        name: 'Stanford University',
        location: 'Stanford, USA',
        country: 'USA',
        ranking: 3,
        tuitionRange: '$56,000 - $62,000/year',
        tuition: 58746,
        admissionRate: 4,
        studentsCount: 17000,
        programs: ['Computer Science', 'Business', 'Engineering'],
        matchScore: 82,
        category: 'Dream',
        website: 'https://stanford.edu',
        image: '/assets/stanford.jpg'
    },
    {
        id: '3',
        name: 'University of Toronto',
        location: 'Toronto, Canada',
        country: 'Canada',
        ranking: 26,
        tuitionRange: '$45,000 - $50,000/year',
        tuition: 47500,
        admissionRate: 43,
        studentsCount: 61000,
        programs: ['Computer Science', 'Data Science', 'Engineering'],
        matchScore: 78,
        category: 'Target',
        website: 'https://utoronto.ca',
        image: '/assets/toronto.jpg'
    },
    {
        id: '4',
        name: 'University of British Columbia',
        location: 'Vancouver, Canada',
        country: 'Canada',
        ranking: 34,
        tuitionRange: '$40,000 - $45,000/year',
        tuition: 42500,
        admissionRate: 52,
        studentsCount: 55000,
        programs: ['Computer Science', 'Business', 'Sciences'],
        matchScore: 76,
        category: 'Target',
        website: 'https://ubc.ca',
        image: '/assets/ubc.jpg'
    },
    {
        id: '5',
        name: 'Imperial College London',
        location: 'London, UK',
        country: 'UK',
        ranking: 8,
        tuitionRange: '$35,000 - $40,000/year',
        tuition: 38000,
        admissionRate: 14,
        studentsCount: 19000,
        programs: ['Engineering', 'Computer Science', 'Data Science'],
        matchScore: 74,
        category: 'Target',
        website: 'https://imperial.ac.uk',
        image: '/assets/imperial.jpg'
    },
    {
        id: '6',
        name: 'ETH Zurich',
        location: 'Zurich, Switzerland',
        country: 'Switzerland',
        ranking: 9,
        tuitionRange: 'CHF 1,500/year',
        tuition: 1500,
        admissionRate: 27,
        studentsCount: 22000,
        programs: ['Computer Science', 'Engineering', 'Mathematics'],
        matchScore: 80,
        category: 'Target',
        website: 'https://ethz.ch',
        image: '/assets/zurich.jpg'
    }
]

export default function LockedUniversitiesPage() {
    const [profile, setProfile] = useState<any>(null)
    const [shortlistedIDs, setShortlistedIDs] = useState<string[]>([])
    const [lockedIDs, setLockedIDs] = useState<string[]>([]) // In a real app, this would be from DB
    const [universityToLock, setUniversityToLock] = useState<University | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Provide locked context to Copilot
    useCopilotReadable({
        description: "The list of universities the user has shortlisted or locked",
        value: { shortlisted: shortlistedIDs, locked: lockedIDs },
    })

    useEffect(() => {
        const init = async () => {
            setIsLoading(true)
            await fetchProfile()
            const savedShortlist = localStorage.getItem('shortlistedUniversities')
            if (savedShortlist) setShortlistedIDs(JSON.parse(savedShortlist))

            const savedLocks = localStorage.getItem('lockedUniversities') // Simulating locked state persistence
            if (savedLocks) setLockedIDs(JSON.parse(savedLocks))

            setIsLoading(false)
        }
        init()
    }, [])

    async function fetchProfile() {
        try {
            const response = await fetch('/api/profile')
            const data = await response.json()
            if (data && data._id) setProfile(data)
        } catch (e) { console.error(e) }
    }

    const handleLockClick = (uni: University) => {
        setUniversityToLock(uni)
    }

    const confirmLock = () => {
        if (!universityToLock) return

        if (!lockedIDs.includes(universityToLock.id)) {
            const newLocked = [...lockedIDs, universityToLock.id]
            setLockedIDs(newLocked)
            localStorage.setItem('lockedUniversities', JSON.stringify(newLocked))
            toast.success(`${universityToLock.name} has been locked for application!`, { position: "bottom-right" })
        }
        setUniversityToLock(null)
    }

    const shortlistedUniversities = MOCK_UNIVERSITIES.filter(uni => shortlistedIDs.includes(uni.id) && !lockedIDs.includes(uni.id))
    const lockedUniversities = MOCK_UNIVERSITIES.filter(uni => lockedIDs.includes(uni.id))

    if (isLoading) {
        return (
            <DashboardShell title="Locked Universities">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell title="Locked Universities" profile={profile}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full space-y-8">

                {/* Header Section */}
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">University Locking for Counselling</h2>
                    <p className="text-muted-foreground">Lock your final choices to start your personalized counselling journey</p>
                </div>

                {/* Info Banner */}
                <div className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-violet-600 to-cyan-500" />
                    <div className="p-3 bg-violet-500/10 rounded-xl text-violet-500 shrink-0">
                        <Lock className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground mb-1">Lock at least one university to start counselling</h3>
                        <p className="text-sm text-muted-foreground/80">Once you lock a university, you&apos;ll get personalized application guidance, document checklists, and expert counselling support.</p>
                    </div>
                </div>

                {/* Shortlisted Section (Now first according to image 1, but user asked for locked first before...) */}
                {/* Actually image 1 shows Shortlisted Universities below the banner. */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-muted rounded-md text-muted-foreground">
                            <Target className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Shortlisted Universities</h3>
                    </div>

                    {shortlistedUniversities.length === 0 && lockedUniversities.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                            <p className="text-muted-foreground">You haven&apos;t shortlisted any universities yet.</p>
                            <Button variant="link" onClick={() => window.location.href = '/universities'}>Go to Discover</Button>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {shortlistedUniversities.map(uni => (
                            <Card key={uni.id} className="relative group overflow-hidden bg-card border border-border/60 hover:border-primary/50 transition-all shadow-sm hover:shadow-lg rounded-2xl flex flex-col">
                                {uni.image && (
                                    <div className="h-32 w-full relative overflow-hidden">
                                        <img src={uni.image} alt={uni.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                                    </div>
                                )}
                                <div className="p-6 space-y-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-lg text-foreground line-clamp-2 leading-tight">
                                                {uni.name}
                                            </h4>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {uni.location}
                                            </div>
                                        </div>
                                        {uni.category === 'Dream' ? (
                                            <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold border border-orange-200">
                                                <Star className="h-3 w-3 fill-current" /> Dream
                                            </span>
                                        ) : (
                                            <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold border border-blue-200">
                                                <Target className="h-3 w-3" /> Target
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between text-xs font-semibold text-foreground/80 py-2 border-y border-border/50">
                                        <div className="flex items-center gap-1.5">
                                            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>Rank #{uni.ranking}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-muted-foreground font-medium">Match:</span>
                                            <span className="text-primary font-bold">{uni.matchScore}%</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full mt-auto h-11 bg-primary hover:bg-primary/90 text-white shadow-md transition-all font-bold gap-2 rounded-xl"
                                        onClick={() => handleLockClick(uni)}
                                    >
                                        <Lock className="h-4 w-4" />
                                        Lock for Counselling
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Locked Section */}
                    {lockedUniversities.length > 0 && (
                        <div className="space-y-4 pt-8 border-t border-border/60 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-green-500/10 rounded-md text-green-500">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Universities in Counselling</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {lockedUniversities.map(uni => (
                                    <Card key={uni.id} className="p-6 bg-green-500/5 border border-green-500/20 shadow-sm rounded-2xl flex flex-col gap-4">
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="space-y-1 text-green-950 dark:text-green-300">
                                                <h4 className="font-bold text-lg line-clamp-2 leading-tight">{uni.name}</h4>
                                                <div className="flex items-center gap-1.5 text-xs opacity-70">
                                                    <MapPin className="h-3 w-3" /> {uni.location}
                                                </div>
                                            </div>
                                            <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold border border-green-200">
                                                <Check className="h-3 w-3" /> Locked
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs py-2 border-y border-green-500/10 text-green-900/60 dark:text-green-300/60">
                                            <div className="flex items-center gap-1.5">
                                                <TrendingUp className="h-3.5 w-3.5" />
                                                <span>Rank #{uni.ranking}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 font-bold">
                                                <span>Match: {uni.matchScore}%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-bold bg-green-500/10 p-2.5 rounded-lg justify-center">
                                            <CheckCircle2 className="h-4 w-4" /> Counselling Started
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Lock Confirmation Dialog */}
                <Dialog open={!!universityToLock} onOpenChange={(open) => !open && setUniversityToLock(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl">Lock {universityToLock?.name}?</DialogTitle>
                            <DialogDescription className="pt-2">
                                Locking this university means you are starting your personalized counselling journey here. You&apos;ll get expert guidance for:
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-2 space-y-2">
                            <ul className="space-y-2 text-sm text-foreground/80 list-disc pl-4">
                                <li>Document preparation</li>
                                <li>SOP customization</li>
                                <li>Application timeline</li>
                                <li>Required tasks</li>
                            </ul>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setUniversityToLock(null)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmLock}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl"
                            >
                                Start Counselling
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardShell>
    )
}
