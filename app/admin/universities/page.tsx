'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Plus,
    Trash2,
    Edit2,
    Search,
    School,
    Globe,
    DollarSign,
    Loader2,
    X
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { DashboardShell } from '@/components/DashboardShell'

interface University {
    id: string
    name: string
    country: string
    ranking: number
    tuition: number
    admissionRate: number
    studentsCount: number
    programs: string[]
    scholarships: number
    description: string
    website: string
}

const EMPTY_UNI: Omit<University, 'id'> = {
    name: '',
    country: '',
    ranking: 0,
    tuition: 0,
    admissionRate: 0,
    studentsCount: 0,
    programs: [],
    scholarships: 0,
    description: '',
    website: '',
}

export default function AdminUniversitiesPage() {
    const [profile, setProfile] = useState<any>(null)
    const [universities, setUniversities] = useState<University[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingUni, setEditingUni] = useState<University | null>(null)
    const [formData, setFormData] = useState<Omit<University, 'id'>>(EMPTY_UNI)
    const [isSaving, setIsSaving] = useState(false)
    const [newProgram, setNewProgram] = useState('')

    useEffect(() => {
        fetchProfile()
        fetchUniversities()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile')
            const data = await response.json()
            if (data && data._id) setProfile(data)
        } catch (e) { console.error(e) }
    }

    const fetchUniversities = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/universities')
            const data = await response.json()
            if (Array.isArray(data)) {
                setUniversities(data.map((u: any) => ({ ...u, id: u._id })))
            }
        } catch (error) {
            console.error('Error fetching universities:', error)
            toast.error('Failed to load universities', {position: "bottom-right" })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!formData.name || !formData.country) {
            toast.error('Name and Country are required', {position: "bottom-right" })
            return
        }

        try {
            setIsSaving(true)
            const method = editingUni ? 'PUT' : 'POST'
            const body = editingUni
                ? { id: editingUni.id, ...formData }
                : formData

            const response = await fetch('/api/universities', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (response.ok) {
                toast.success(`University ${editingUni ? 'updated' : 'created'} successfully`, {position: "bottom-right" })
                setIsDialogOpen(false)
                setEditingUni(null)
                setFormData(EMPTY_UNI)
                fetchUniversities()
            } else {
                toast.error('Failed to save university', {position: "bottom-right" })
            }
        } catch (error) {
            toast.error('Something went wrong', {position: "bottom-right" })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this university?')) return

        try {
            const response = await fetch(`/api/universities?id=${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success('University deleted successfully', {position: "bottom-right" })
                fetchUniversities()
            }
        } catch (error) {
            toast.error('Failed to delete university', {position: "bottom-right" })
        }
    }

    const openEditDialog = (uni: University) => {
        setEditingUni(uni)
        const { id, ...data } = uni
        setFormData(data)
        setIsDialogOpen(true)
    }

    const openAddDialog = () => {
        setEditingUni(null)
        setFormData(EMPTY_UNI)
        setIsDialogOpen(true)
    }

    const addProgram = () => {
        if (newProgram.trim()) {
            setFormData({
                ...formData,
                programs: [...formData.programs, newProgram.trim()]
            })
            setNewProgram('')
        }
    }

    const removeProgram = (index: number) => {
        setFormData({
            ...formData,
            programs: formData.programs.filter((_, i) => i !== index)
        })
    }

    const filteredUnis = universities.filter(uni =>
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.country.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardShell title="University Management" profile={profile}>
            <div className="p-6 md:p-8 max-w-7xl mx-auto w-full h-full space-y-8 overflow-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                            <School className="h-8 w-8 text-primary" />
                            Database Management
                        </h1>
                        <p className="text-muted-foreground">Manage the global university repository for all users.</p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add University
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-card border-border rounded-3xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">{editingUni ? 'Edit' : 'Add'} University</DialogTitle>
                                <DialogDescription>Fill in the details for the university repository.</DialogDescription>
                            </DialogHeader>

                            <div className="grid md:grid-cols-2 gap-6 py-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-70">University Name</label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="bg-muted/50 border-border h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-70">Country</label>
                                        <Input
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="bg-muted/50 border-border h-11"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold opacity-70">Global Rank</label>
                                            <Input
                                                type="number"
                                                value={formData.ranking}
                                                onChange={(e) => setFormData({ ...formData, ranking: parseInt(e.target.value) })}
                                                className="bg-muted/50 border-border h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold opacity-70">Tuition ($)</label>
                                            <Input
                                                type="number"
                                                value={formData.tuition}
                                                onChange={(e) => setFormData({ ...formData, tuition: parseInt(e.target.value) })}
                                                className="bg-muted/50 border-border h-11"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold opacity-70">Accept Rate (%)</label>
                                            <Input
                                                type="number"
                                                value={formData.admissionRate}
                                                onChange={(e) => setFormData({ ...formData, admissionRate: parseFloat(e.target.value) })}
                                                className="bg-muted/50 border-border h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold opacity-70">Students</label>
                                            <Input
                                                type="number"
                                                value={formData.studentsCount}
                                                onChange={(e) => setFormData({ ...formData, studentsCount: parseInt(e.target.value) })}
                                                className="bg-muted/50 border-border h-11"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-70">Website URL</label>
                                        <Input
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="bg-muted/50 border-border h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-70">Programs (Add and Enter)</label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={newProgram}
                                                onChange={(e) => setNewProgram(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addProgram()}
                                                placeholder="Add program..."
                                                className="bg-muted/50 border-border h-11"
                                            />
                                            <Button onClick={addProgram} variant="secondary" className="h-11 px-4">Add</Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.programs.map((p, idx) => (
                                                <span key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20">
                                                    {p}
                                                    <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeProgram(idx)} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold opacity-70">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-xl p-4 min-h-[100px] text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="Enter university description..."
                                    />
                                </div>
                            </div>

                            <DialogFooter className="gap-3">
                                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancel</Button>
                                <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
                                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingUni ? 'Update University' : 'Create University'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Filter by name or country..."
                            className="pl-12 h-12 bg-transparent border-none focus-visible:ring-0 shadow-none text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <p className="text-muted-foreground font-medium animate-pulse">Loading university database...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUnis.map((uni) => (
                            <Card key={uni.id} className="bg-card border-border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 group rounded-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <School className="h-6 w-6" />
                                    </div>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => openEditDialog(uni)}
                                            className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDelete(uni.id)}
                                            className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{uni.name}</h3>
                                <p className="text-muted-foreground text-sm flex items-center gap-1.5 mb-5 font-medium">
                                    <Globe className="h-4 w-4 text-primary/70" /> {uni.country}
                                </p>

                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-border">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Global Rank</p>
                                        <p className="text-lg font-black text-foreground">#{uni.ranking}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Tuition</p>
                                        <p className="text-lg font-black text-green-600">${uni.tuition.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="pt-4 flex flex-wrap gap-2 border-t border-border">
                                    {uni.programs.slice(0, 2).map((p, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-muted text-[10px] font-bold text-muted-foreground rounded-md uppercase">
                                            {p}
                                        </span>
                                    ))}
                                    {uni.programs.length > 2 && (
                                        <span className="px-2 py-0.5 bg-muted text-[10px] font-bold text-muted-foreground rounded-md uppercase">
                                            +{uni.programs.length - 2} more
                                        </span>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardShell>
    )
}
