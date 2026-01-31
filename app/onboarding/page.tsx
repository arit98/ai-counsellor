'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, ArrowLeft, Compass, Check, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

const STEPS = [
  'Personal Info',
  'Academic Profile',
  'Interests & Goals',
  'Preferences',
  'Complete'
]

interface ProfileData {
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

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [profileData, setProfileData] = useState<ProfileData>({
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
  })

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

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return profileData.firstName && profileData.lastName && profileData.dateOfBirth && profileData.citizenship
      case 1:
        return profileData.currentLevel && profileData.gpa && profileData.studyField
      case 2:
        return profileData.degreeLevel && profileData.careerGoals && profileData.intendedYear
      case 3:
        return profileData.countryPreferences.length > 0 && profileData.budgetRange
      case 4:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (isStepValid() && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user._id) {
        toast.error('User not found. Please log in again.')
        window.location.href = '/'
        return
      }

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profileData, userId: user._id }),
      })
      if (response.ok) {
        toast.success('Profile saved successfully!')
        window.location.href = '/dashboard'
      } else {
        const errorData = await response.json()
        console.error('Failed to save profile:', errorData.error)
        toast.error('Failed to save profile: ' + errorData.error)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('An error occurred while saving your profile')
    }
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-6 md:px-12 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Compass className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="font-bold text-foreground text-lg">Clarity Compass</span>
                <span className="block text-xs text-muted-foreground">Profile Setup</span>
              </div>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Skip for now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 px-6 py-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            {STEPS.map((step, idx) => (
              <div key={idx} className="flex-1">
                <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${idx < currentStep
                        ? 'w-full bg-gradient-to-r from-violet-500 to-cyan-500'
                        : idx === currentStep
                          ? 'w-full bg-gradient-to-r from-violet-500 to-violet-400'
                          : 'w-0'
                      }`}
                  />
                </div>
                <p className={`text-xs mt-2 font-medium ${idx <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-8 md:px-12 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/10 to-cyan-600/20 rounded-3xl blur-xl" />
            <Card className="relative bg-card border-border p-8 md:p-12 rounded-2xl">
              {/* Step 1: Personal Info */}
              {currentStep === 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Personal Information</h2>
                    <p className="text-muted-foreground">Tell us a bit about yourself</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-foreground text-sm font-medium">First Name</Label>
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                        className="bg-input border-border text-foreground mt-2 h-12 rounded-xl focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground text-sm font-medium">Last Name</Label>
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Doe"
                        className="bg-input border-border text-foreground mt-2 h-12 rounded-xl focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-foreground text-sm font-medium">Date of Birth</Label>
                      <Input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="bg-input border-border text-foreground mt-2 h-12 rounded-xl focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground text-sm font-medium">Citizenship</Label>
                      <Select value={profileData.citizenship} onValueChange={(val) => handleInputChange('citizenship', val)}>
                        <SelectTrigger className="bg-input border-border text-foreground mt-2 h-12 rounded-xl">
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
                </div>
              )}

              {/* Step 2: Academic Profile */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Academic Profile</h2>
                    <p className="text-muted-foreground">Share your educational background</p>
                  </div>

                  <div>
                    <Label className="text-foreground text-sm font-medium">Current Education Level</Label>
                    <Select value={profileData.currentLevel} onValueChange={(val) => handleInputChange('currentLevel', val)}>
                      <SelectTrigger className="bg-input border-border text-foreground mt-2 h-12 rounded-xl">
                        <SelectValue placeholder="Select your current level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12th">12th Grade</SelectItem>
                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-foreground text-sm font-medium">CGPA/GPA (0-4.0)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      max="4.0"
                      value={profileData.gpa}
                      onChange={(e) => handleInputChange('gpa', e.target.value)}
                      placeholder="3.8"
                      className="bg-input border-border text-foreground mt-2 h-12 rounded-xl focus:border-violet-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-foreground text-sm font-medium">GMAT Score (optional)</Label>
                      <Input
                        type="number"
                        value={profileData.gmatScore}
                        onChange={(e) => handleInputChange('gmatScore', e.target.value)}
                        placeholder="700"
                        className="bg-input border-border text-foreground mt-2 h-12 rounded-xl focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground text-sm font-medium">IELTS Score (optional)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={profileData.ieltsScore}
                        onChange={(e) => handleInputChange('ieltsScore', e.target.value)}
                        placeholder="7.5"
                        className="bg-input border-border text-foreground mt-2 h-12 rounded-xl focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground text-sm font-medium">TOEFL Score (optional)</Label>
                      <Input
                        type="number"
                        value={profileData.toeflScore}
                        onChange={(e) => handleInputChange('toeflScore', e.target.value)}
                        placeholder="100"
                        className="bg-input border-border text-foreground mt-2 h-12 rounded-xl focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground text-sm font-medium">Field of Study</Label>
                    <Select value={profileData.studyField} onValueChange={(val) => handleInputChange('studyField', val)}>
                      <SelectTrigger className="bg-input border-border text-foreground mt-2 h-12 rounded-xl">
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
              )}

              {/* Step 3: Interests & Goals */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Interests & Goals</h2>
                    <p className="text-muted-foreground">What are your aspirations?</p>
                  </div>

                  <div>
                    <Label className="text-foreground text-sm font-medium">Degree Level You Want to Pursue</Label>
                    <Select value={profileData.degreeLevel} onValueChange={(val) => handleInputChange('degreeLevel', val)}>
                      <SelectTrigger className="bg-input border-border text-foreground mt-2 h-12 rounded-xl">
                        <SelectValue placeholder="Select degree level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="certificate">Certificate/Diploma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-foreground text-sm font-medium">Career Goals</Label>
                    <Textarea
                      value={profileData.careerGoals}
                      onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                      placeholder="Describe your career aspirations and what you hope to achieve with your degree..."
                      className="bg-input border-border text-foreground mt-2 min-h-28 rounded-xl focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground text-sm font-medium">When do you intend to start your studies?</Label>
                    <Select value={profileData.intendedYear} onValueChange={(val) => handleInputChange('intendedYear', val)}>
                      <SelectTrigger className="bg-input border-border text-foreground mt-2 h-12 rounded-xl">
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
              )}

              {/* Step 4: Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Study Preferences</h2>
                    <p className="text-muted-foreground">Where would you like to study?</p>
                  </div>

                  <div>
                    <Label className="text-foreground mb-4 block text-sm font-medium">Countries/Regions of Interest</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {['USA', 'UK', 'Canada', 'Australia', 'Europe', 'Asia'].map((country) => (
                        <div
                          key={country}
                          onClick={() => handleCountryToggle(country)}
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${profileData.countryPreferences.includes(country)
                              ? 'border-violet-500 bg-violet-500/10'
                              : 'border-border hover:border-violet-500/50 hover:bg-white/5'
                            }`}
                        >
                          <Checkbox
                            id={country}
                            checked={profileData.countryPreferences.includes(country)}
                            onCheckedChange={() => handleCountryToggle(country)}
                            className="border-border data-[state=checked]:bg-violet-500"
                          />
                          <Label htmlFor={country} className="text-foreground cursor-pointer font-medium">
                            {country}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground mb-4 block text-sm font-medium">Budget Range (Annual)</Label>
                    <RadioGroup value={profileData.budgetRange} onValueChange={(val) => handleInputChange('budgetRange', val)} className="space-y-3">
                      {[
                        { value: 'low', label: 'Under $15,000' },
                        { value: 'medium', label: '$15,000 - $30,000' },
                        { value: 'high', label: '$30,000 - $50,000' },
                        { value: 'premium', label: 'Above $50,000' }
                      ].map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${profileData.budgetRange === option.value
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-border hover:border-cyan-500/50 hover:bg-white/5'
                            }`}
                          onClick={() => handleInputChange('budgetRange', option.value)}
                        >
                          <RadioGroupItem value={option.value} id={option.value} className="border-border" />
                          <Label htmlFor={option.value} className="text-foreground cursor-pointer font-medium">{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 5: Complete */}
              {currentStep === 4 && (
                <div className="space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-3">Profile Complete!</h2>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                      Your profile is ready. Get personalized university recommendations powered by AI.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button
                      onClick={handleComplete}
                      className="relative overflow-hidden h-14 px-10 text-lg rounded-full group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500" />
                      <span className="relative flex items-center gap-2 font-semibold">
                        Go to Dashboard
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              {currentStep < 4 && (
                <div className="flex gap-4 mt-12">
                  <Button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="border-border bg-transparent hover:bg-white/5 rounded-xl h-12 px-6"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="ml-auto relative overflow-hidden h-12 px-8 rounded-xl group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 opacity-90" />
                    <span className="relative flex items-center gap-2">
                      Next
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
