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
    CheckCircle2
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

    const fetchProfile = async () => {
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
                    <h2 className="text-3xl font-bold tracking-tight">University Locking</h2>
                    <p className="text-muted-foreground">Lock your final choices to begin the application process</p>
                </div>

                {/* Info Banner */}
                <div className="bg-card border-l-4 border-primary shadow-sm rounded-r-xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-linear-to-r from-card to-secondary/20">
                    <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
                        <Lock className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-foreground mb-1">Lock at least one university to start applying</h3>
                        <p className="text-sm text-muted-foreground">Once you lock a university, you'll get personalized application guidance, document checklists, and timeline recommendations.</p>
                    </div>
                </div>

                {/* Shortlisted Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-xl font-semibold text-foreground">Shortlisted Universities</h3>
                    </div>

                    {shortlistedUniversities.length === 0 && lockedUniversities.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                            <p className="text-muted-foreground">You haven't shortlisted any universities yet.</p>
                            <Button variant="link" onClick={() => window.location.href = '/universities'}>Go to Discover</Button>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shortlistedUniversities.map(uni => (
                            <Card key={uni.id} className="p-5 flex flex-col justify-between h-auto gap-4 border-l-4 border-l-transparent hover:border-l-primary transition-all shadow-sm hover:shadow-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg line-clamp-2 leading-tight mb-1">{uni.name}</h4>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <MapPin className="h-3 w-3" /> {uni.location}
                                        </div>
                                    </div>
                                    {uni.category === 'Dream' ? (
                                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold border border-orange-200">
                                            <Star className="h-3 w-3 fill-current" /> Dream
                                        </span>
                                    ) : (
                                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold border border-blue-200">
                                            <Target className="h-3 w-3" /> Target
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-sm py-2 border-t border-b border-border/50 my-1">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>Rank #{uni.ranking}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                                        <span>Match: {uni.matchScore}%</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md transition-all font-semibold"
                                    onClick={() => handleLockClick(uni)}
                                >
                                    <Lock className="h-4 w-4 mr-2" /> Lock for Application
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Locked Section (Optional, if we want to show already locked ones) */}
                {lockedUniversities.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <h3 className="text-xl font-semibold text-foreground">Locked for Application</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lockedUniversities.map(uni => (
                                <Card key={uni.id} className="p-5 flex flex-col justify-between h-auto gap-4 border-l-4 border-l-green-500 bg-green-50/10 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg line-clamp-2 leading-tight mb-1">{uni.name}</h4>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <MapPin className="h-3 w-3" /> {uni.location}
                                            </div>
                                        </div>
                                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold border border-green-200">
                                            Locked
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2 border-t border-b border-border/50 my-1">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>Rank #{uni.ranking}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 font-bold text-foreground">
                                            <span>Match: {uni.matchScore}%</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full border-green-200 text-green-700 hover:bg-green-50 cursor-default"
                                    >
                                        Application Started
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lock Confirmation Dialog */}
                <Dialog open={!!universityToLock} onOpenChange={(open) => !open && setUniversityToLock(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl">Lock {universityToLock?.name}?</DialogTitle>
                            <DialogDescription className="pt-2">
                                Locking this university means you&apos;re committing to apply here. You&apos;ll get personalized guidance for:
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
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                            >
                                Lock University
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardShell>
    )
}
