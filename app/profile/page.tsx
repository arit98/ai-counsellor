'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { DashboardShell } from '@/components/DashboardShell'
import { User, Save, Loader2 } from 'lucide-react'

interface ProfileData {
    userId?: string
    firstName: string
    lastName: string
    dateOfBirth: string
    citizenship: string
    currentLevel: string
    gpa: string
    gmatScore: string
    ieltsScore: string
    toeflScore: string
    studyField: string
    degreeLevel: string
    careerGoals: string
    countryPreferences: string[]
    budgetRange: string
    intendedYear: string
}

const INITIAL_PROFILE: ProfileData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    citizenship: '',
    currentLevel: '',
    gpa: '',
    gmatScore: '',
    ieltsScore: '',
    toeflScore: '',
    studyField: '',
    degreeLevel: '',
    careerGoals: '',
    countryPreferences: [],
    budgetRange: '',
    intendedYear: ''
}

export default function ProfilePage() {
    const [profileData, setProfileData] = useState<ProfileData>(INITIAL_PROFILE)
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [userProfile, setUserProfile] = useState<any>(null)

    useEffect(() => {
        fetchProfile()
    }, [])

    async function fetchProfile() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            if (user._id) {
                const response = await fetch(`/api/profile?userId=${user._id}`)
                const data = await response.json()

                if (data && !data.error && data.firstName) {
                    setProfileData(data)
                    setUserProfile(data)
                } else {
                    // Pre-fill from user object if profile doesn't exist
                    setProfileData(prev => ({
                        ...prev,
                        firstName: user.name?.split(' ')[0] || '',
                        lastName: user.name?.split(' ')[1] || '',
                    }))
                }
            }
        } catch (e) {
            console.error(e)
            toast.error("Failed to load profile", { position: "bottom-right" })
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }))
    }

    const handleCountryToggle = (country: string) => {
        setProfileData(prev => ({
            ...prev,
            countryPreferences: prev.countryPreferences.includes(country)
                ? prev.countryPreferences.filter(c => c !== country)
                : [...prev.countryPreferences, country]
        }))
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            const user = JSON.parse(localStorage.getItem('user') || '{}')

            if (!user._id) {
                toast.error('User not authenticated', { position: "bottom-right" })
                return
            }

            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...profileData, userId: user._id }),
            })

            if (response.ok) {
                toast.success('Profile updated successfully!', { position: "bottom-right" })
                fetchProfile() // Refresh data
            } else {
                const errorData = await response.json()
                toast.error('Failed to update profile: ' + errorData.error, { position: "bottom-right" })
            }
        } catch (error) {
            console.error('Error saving profile:', error)
            toast.error('An error occurred while saving', { position: "bottom-right" })
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return (
            <DashboardShell title="My Profile" profile={userProfile}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading profile...</p>
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell title="My Profile" profile={userProfile}>
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
                        <p className="text-muted-foreground">Update your personal and academic information for better recommendations.</p>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]">
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>

                <div className="grid gap-6">
                    {/* Personal Information */}
                    <Card className="p-6 space-y-6 bg-card border-border">
                        <div className="flex items-center gap-2 pb-2 border-b border-border">
                            <User className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-foreground">First Name</Label>
                                <Input
                                    value={profileData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    placeholder="John"
                                    className="bg-input border-border text-foreground mt-2"
                                />
                            </div>
                            <div>
                                <Label className="text-foreground">Last Name</Label>
                                <Input
                                    value={profileData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    placeholder="Doe"
                                    className="bg-input border-border text-foreground mt-2"
                                />
                            </div>
                            <div>
                                <Label className="text-foreground">Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={profileData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="bg-input border-border text-foreground mt-2"
                                />
                            </div>
                            <div>
                                <Label className="text-foreground">Citizenship</Label>
                                <Select value={profileData.citizenship} onValueChange={(val) => handleInputChange('citizenship', val)}>
                                    <SelectTrigger className="bg-input border-border text-foreground mt-2">
                                        <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="india">India</SelectItem>
                                        <SelectItem value="china">China</SelectItem>
                                        <SelectItem value="usa">USA</SelectItem>
                                        <SelectItem value="uk">UK</SelectItem>
                                        <SelectItem value="canada">Canada</SelectItem>
                                        <SelectItem value="australia">Australia</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Academic Profile */}
                    <Card className="p-6 space-y-6 bg-card border-border">
                        <div className="flex items-center gap-2 pb-2 border-b border-border">
                            <h2 className="text-xl font-semibold text-foreground">Academic Profile</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-foreground">Current Education Level</Label>
                                <Select value={profileData.currentLevel} onValueChange={(val) => handleInputChange('currentLevel', val)}>
                                    <SelectTrigger className="bg-input border-border text-foreground mt-2">
                                        <SelectValue placeholder="Select your current level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="12th">12th Grade</SelectItem>
                                        <SelectItem value="bachelors">Bachelor&apos;s Degree</SelectItem>
                                        <SelectItem value="masters">Master&apos;s Degree</SelectItem>
                                        <SelectItem value="phd">PhD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-foreground">CGPA/GPA (0-4.0)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    max="4.0"
                                    value={profileData.gpa}
                                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                                    placeholder="3.8"
                                    className="bg-input border-border text-foreground mt-2"
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-foreground">GMAT Score</Label>
                                    <Input
                                        type="number"
                                        value={profileData.gmatScore}
                                        onChange={(e) => handleInputChange('gmatScore', e.target.value)}
                                        placeholder="700"
                                        className="bg-input border-border text-foreground mt-2"
                                    />
                                </div>
                                <div>
                                    <Label className="text-foreground">IELTS Score</Label>
                                    <Input
                                        type="number"
                                        step="0.5"
                                        value={profileData.ieltsScore}
                                        onChange={(e) => handleInputChange('ieltsScore', e.target.value)}
                                        placeholder="7.5"
                                        className="bg-input border-border text-foreground mt-2"
                                    />
                                </div>
                                <div>
                                    <Label className="text-foreground">TOEFL Score</Label>
                                    <Input
                                        type="number"
                                        value={profileData.toeflScore}
                                        onChange={(e) => handleInputChange('toeflScore', e.target.value)}
                                        placeholder="100"
                                        className="bg-input border-border text-foreground mt-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-foreground">Field of Study</Label>
                                <Select value={profileData.studyField} onValueChange={(val) => handleInputChange('studyField', val)}>
                                    <SelectTrigger className="bg-input border-border text-foreground mt-2">
                                        <SelectValue placeholder="Select your field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="engineering">Engineering</SelectItem>
                                        <SelectItem value="business">Business & Management</SelectItem>
                                        <SelectItem value="cs">Computer Science</SelectItem>
                                        <SelectItem value="medicine">Medicine & Health</SelectItem>
                                        <SelectItem value="arts">Arts & Humanities</SelectItem>
                                        <SelectItem value="science">Science</SelectItem>
                                        <SelectItem value="law">Law</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Interests & Goals */}
                    <Card className="p-6 space-y-6 bg-card border-border">
                        <div className="flex items-center gap-2 pb-2 border-b border-border">
                            <h2 className="text-xl font-semibold text-foreground">Interests & Goals</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-foreground">Desired Degree Level</Label>
                                <Select value={profileData.degreeLevel} onValueChange={(val) => handleInputChange('degreeLevel', val)}>
                                    <SelectTrigger className="bg-input border-border text-foreground mt-2">
                                        <SelectValue placeholder="Select degree level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bachelor">Bachelor&apos;s Degree</SelectItem>
                                        <SelectItem value="master">Master&apos;s Degree</SelectItem>
                                        <SelectItem value="phd">PhD</SelectItem>
                                        <SelectItem value="certificate">Certificate/Diploma</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-foreground">Career Goals</Label>
                                <Textarea
                                    value={profileData.careerGoals}
                                    onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                                    placeholder="Describe your career aspirations..."
                                    className="bg-input border-border text-foreground mt-2 min-h-28"
                                />
                            </div>

                            <div>
                                <Label className="text-foreground">Target Start Year</Label>
                                <Select value={profileData.intendedYear} onValueChange={(val) => handleInputChange('intendedYear', val)}>
                                    <SelectTrigger className="bg-input border-border text-foreground mt-2">
                                        <SelectValue placeholder="Select start year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2025">2025</SelectItem>
                                        <SelectItem value="2026">2026</SelectItem>
                                        <SelectItem value="2027">2027</SelectItem>
                                        <SelectItem value="later">Later</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Preferences */}
                    <Card className="p-6 space-y-6 bg-card border-border">
                        <div className="flex items-center gap-2 pb-2 border-b border-border">
                            <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <Label className="text-foreground mb-4 block">Countries of Interest</Label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {['USA', 'UK', 'Canada', 'Australia', 'Europe', 'Asia'].map((country) => (
                                        <div key={country} className="flex items-center gap-3">
                                            <Checkbox
                                                id={country}
                                                checked={profileData.countryPreferences.includes(country)}
                                                onCheckedChange={() => handleCountryToggle(country)}
                                                className="border-border"
                                            />
                                            <Label htmlFor={country} className="text-foreground cursor-pointer">
                                                {country}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label className="text-foreground mb-4 block">Annual Budget Range</Label>
                                <RadioGroup value={profileData.budgetRange} onValueChange={(val) => handleInputChange('budgetRange', val)}>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="low" id="low" />
                                        <Label htmlFor="low" className="text-foreground cursor-pointer">Under $15,000</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="medium" id="medium" />
                                        <Label htmlFor="medium" className="text-foreground cursor-pointer">$15,000 - $30,000</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="high" id="high" />
                                        <Label htmlFor="high" className="text-foreground cursor-pointer">$30,000 - $50,000</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="premium" id="premium" />
                                        <Label htmlFor="premium" className="text-foreground cursor-pointer">Above $50,000</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    )
}
