'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MapPin,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Heart,
  TrendingUp,
  Target,
  DollarSign,
  Plus,
  Check,
  Star,
  GraduationCap
} from 'lucide-react'
import { toast } from 'sonner'
import { DashboardShell } from '@/components/DashboardShell'
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"

interface University {
  id: string
  name: string
  location: string
  country: string
  ranking: number
  tuitionRange: string
  tuition: number // kept for sorting
  admissionRate: number
  studentsCount: number
  programs: string[]
  matchScore: number
  category: 'Dream' | 'Target' | 'Reach' | 'Safety'
  website: string
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
    // image: '/assets/mit.jpg'
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
    // image: '/assets/stanford.jpg'
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
    // image: '/assets/toronto.jpg'
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
    // image: '/assets/ubc.jpg'
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
    // image: '/assets/imperial.jpg'
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
    // image: '/assets/zurich.jpg'
  }
]

export default function UniversitiesPage() {
  const [profile, setProfile] = useState<any>(null)
  const [universities, setUniversities] = useState<University[]>([])
  const [shortlisted, setShortlisted] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('All Countries')
  const [sortBy, setSortBy] = useState('ranking')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)

  // Provide university list context to Copilot
  useCopilotReadable({
    description: "The list of universities available to discover",
    value: universities,
  })

  // Provide filter actions to Copilot
  useCopilotAction({
    name: "filterUniversities",
    description: "Filter universities by country or search term",
    parameters: [
      {
        name: "country",
        type: "string",
        description: "The country to filter by (e.g., 'USA', 'UK', 'All Countries')",
        required: false,
      },
      {
        name: "search",
        type: "string",
        description: "The search term for university names or programs",
        required: false,
      },
    ],
    handler: ({ country, search }) => {
      if (country) setSelectedCountry(country)
      if (search !== undefined) setSearchTerm(search)
    },
  })

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await Promise.all([fetchProfile(), fetchUniversities()])
      const saved = localStorage.getItem('shortlistedUniversities')
      if (saved) setShortlisted(JSON.parse(saved))
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

  const fetchUniversities = async () => {
    // In a real app, this would fetch from API and merge with local match scores
    // For now, we use the enriched MOCK_UNIVERSITIES to match the requested design
    setUniversities(MOCK_UNIVERSITIES)
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const toggleShortlist = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const isAdding = !shortlisted.includes(id)
    const uni = universities.find(u => u.id === id)

    const newShortlisted = isAdding
      ? [...shortlisted, id]
      : shortlisted.filter(item => item !== id)

    setShortlisted(newShortlisted)
    localStorage.setItem('shortlistedUniversities', JSON.stringify(newShortlisted))

    if (isAdding) {
      toast.success(`${uni?.name || 'University'} added to shortlist`, { position: "bottom-right" })
    } else {
      toast.info(`${uni?.name || 'University'} removed from shortlist`, { position: "bottom-right" })
    }
  }

  const filtered = useMemo(() => {
    return universities
      .filter(uni => {
        const matchesCountry = selectedCountry === 'All Countries' || uni.country === selectedCountry
        const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          uni.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          uni.programs.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesCountry && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'tuition') return a.tuition - b.tuition
        if (sortBy === 'match') return b.matchScore - a.matchScore
        return a.ranking - b.ranking
      })
  }, [universities, selectedCountry, searchTerm, sortBy])

  const countries = useMemo(() => {
    return ['All Countries', ...new Set(universities.map(u => u.country))]
  }, [universities])

  if (isLoading) {
    return (
      <DashboardShell title="Discover Universities">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Finding the best universities for you...</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Universities" profile={profile}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
        {/* Filters Area */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search universities, programs or location..."
              className="pl-12 h-12 bg-card border-border rounded-xl focus-visible:ring-primary shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-[180px] h-12 bg-card border-border rounded-xl shadow-sm">
                <Filter className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {countries.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex bg-card border border-border rounded-xl p-1 shadow-sm">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-lg h-10 w-10"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-lg h-10 w-10"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground font-medium">
            Showing <span className="text-foreground font-bold">{filtered.length}</span> universities
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-10 bg-transparent border-none font-semibold text-primary focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="ranking">Top Ranking</SelectItem>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="tuition">Lowest Tuition</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Universities List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((uni) => (
              <Card key={uni.id} className="group flex flex-col justify-between bg-card border-2 border-border/60 hover:border-primary/50 overflow-hidden rounded-[20px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div>
                  {/* Header: Name + Badge */}
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {uni.name}
                    </h3>
                    {uni.category === 'Dream' && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
                        <Star className="h-3 w-3 fill-current" /> Dream
                      </span>
                    )}
                    {uni.category === 'Target' && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
                        <Target className="h-3 w-3" /> Target
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-5">
                    <MapPin className="h-3.5 w-3.5" />
                    {uni.location}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">Rank #{uni.ranking}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">{uni.admissionRate}% accept</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">{uni.tuitionRange}</span>
                    </div>
                  </div>

                  {/* Programs */}
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Programs:</p>
                    <div className="flex flex-wrap gap-2">
                      {uni.programs.slice(0, 3).map(p => (
                        <span key={p} className="px-2.5 py-1 bg-muted/50 text-foreground text-xs font-medium rounded-lg border border-border/50">
                          {p}
                        </span>
                      ))}
                      {uni.programs.length > 3 && (
                        <span className="px-2.5 py-1 bg-muted/50 text-muted-foreground text-xs font-medium rounded-lg border border-border/50">
                          +{uni.programs.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Score & Action */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-foreground">Match Score:</span>
                      <span className="font-bold text-foreground">{uni.matchScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                        style={{ width: `${uni.matchScore}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    className={`w-full font-bold rounded-xl transition-all duration-300 ${shortlisted.includes(uni.id)
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25'
                      : 'bg-transparent hover:bg-muted text-foreground border-2 border-border hover:border-primary/20'
                      }`}
                    onClick={(e) => toggleShortlist(uni.id, e)}
                  >
                    {shortlisted.includes(uni.id) ? (
                      <>
                        <Check className="h-4 w-4 mr-2" /> Shortlisted
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" /> Shortlist
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* List View - Consolidate to similar style or keep simple */}
            {filtered.map((uni) => (
              <Card key={uni.id} className="bg-card border-border hover:border-primary/50 transition-colors rounded-xl overflow-hidden p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{uni.name}</h3>
                      {uni.category === 'Dream' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">Dream</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">Target</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {uni.location}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="h-4 w-4" /> Rank #{uni.ranking}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {uni.tuitionRange}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {uni.programs.map(p => (
                        <span key={p} className="px-2 py-1 bg-muted rounded-md text-xs font-medium">{p}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Match</span>
                        <span>{uni.matchScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${uni.matchScore}%` }} />
                      </div>
                    </div>
                    <Button
                      onClick={(e) => toggleShortlist(uni.id, e)}
                      variant={shortlisted.includes(uni.id) ? "default" : "outline"}
                      className="w-full"
                    >
                      {shortlisted.includes(uni.id) ? "Shortlisted" : "Shortlist"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
