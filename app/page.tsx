'use client'

import React, { useState, useRef } from "react"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowRight,
  GraduationCap,
  Globe,
  BookOpen,
  Sparkles,
  Compass,
  MapPin,
  Users,
  Zap,
  ChevronRight,
  Star,
  Play
} from 'lucide-react'
import { toast } from 'sonner'

// University data
const FEATURED_UNIVERSITIES = [
  { name: 'MIT', fullName: 'Massachusetts Institute of Technology', location: 'Cambridge, USA', image: '/assets/mit.jpg', rank: 1 },
  { name: 'Stanford', fullName: 'Stanford University', location: 'California, USA', image: '/assets/stanford.jpg', rank: 3 },
  { name: 'Cambridge', fullName: 'University of Cambridge', location: 'Cambridge, UK', image: '/assets/cambridge.jpg', rank: 2 },
  { name: 'Oxford', fullName: 'University of Oxford', location: 'Oxford, UK', image: '/assets/oxford.jpg', rank: 4 },
  { name: 'ETH Zurich', fullName: 'ETH Zurich', location: 'Zurich, Switzerland', image: '/assets/zurich.jpg', rank: 7 },
  { name: 'NUS', fullName: 'National University of Singapore', location: 'Singapore', image: '/assets/nus.jpg', rank: 8 },
]

// Disciplines with icons
const DISCIPLINES = [
  { name: 'Artificial Intelligence', icon: '🤖' },
  { name: 'Computer Science', icon: '💻' },
  { name: 'Data Science', icon: '📊' },
  { name: 'Engineering', icon: '⚙️' },
  { name: 'Business', icon: '📈' },
  { name: 'Medicine', icon: '🏥' },
  { name: 'Research', icon: '🔬' },
  { name: 'Finance', icon: '💰' },
]

// Countries with flags
const COUNTRIES = [
  { name: 'USA', flag: '🇺🇸', universities: 35 },
  { name: 'UK', flag: '🇬🇧', universities: 18 },
  { name: 'Canada', flag: '🇨🇦', universities: 12 },
  { name: 'Germany', flag: '🇩🇪', universities: 10 },
  { name: 'Australia', flag: '🇦🇺', universities: 8 },
  { name: 'Singapore', flag: '🇸🇬', universities: 4 },
  { name: 'Ireland', flag: '🇮🇪', universities: 5 },
  { name: 'Switzerland', flag: '🇨🇭', universities: 3 },
]

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeUniversity, setActiveUniversity] = useState(0)

  const handleAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data))
        toast.success(authMode === 'login' ? 'Welcome back!' : 'Account created successfully!')
        window.location.href = '/dashboard'
      } else {
        toast.error(data.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#030014] text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-transparent blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-transparent blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-pink-500/10 to-orange-500/10 blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 py-5 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl blur-lg opacity-50" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <Compass className="text-white w-6 h-6" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Clarity Compass
              </span>
              <span className="hidden md:block text-[10px] text-white/40 uppercase tracking-[0.2em]">AI Study Abroad</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#universities" className="text-sm text-white/60 hover:text-white transition-colors">Universities</a>
            <a href="#disciplines" className="text-sm text-white/60 hover:text-white transition-colors">Programs</a>
            <a href="#countries" className="text-sm text-white/60 hover:text-white transition-colors">Destinations</a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleAuth('login')}
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              Sign In
            </Button>
            <Button
              onClick={() => handleAuth('signup')}
              className="relative group overflow-hidden rounded-full px-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 transition-transform group-hover:scale-110" />
              <span className="relative flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Unique Split Layout */}
      <section className="relative z-10 min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300">AI-Powered Guidance</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              Your Global
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  Education
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 150 2 298 10" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                      <stop stopColor="#8B5CF6" />
                      <stop offset="0.5" stopColor="#D946EF" />
                      <stop offset="1" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              Journey Starts
            </h1>

            <p className="text-xl text-white/50 max-w-lg leading-relaxed">
              Navigate your study abroad dreams with AI precision. From university selection to application success — we guide every step.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => handleAuth('signup')}
                size="lg"
                className="relative group h-14 px-8 rounded-full text-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 transition-all duration-300 group-hover:scale-110" />
                <span className="relative flex items-center gap-2 font-semibold">
                  Start Free Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-full text-lg border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">95+</div>
                <div className="text-sm text-white/40">Universities</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">11</div>
                <div className="text-sm text-white/40">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">98%</div>
                <div className="text-sm text-white/40">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right - Interactive University Cards */}
          <div className="relative hidden lg:block">
            {/* Floating 3D-like cards */}
            <div className="relative w-full h-[500px]">
              {FEATURED_UNIVERSITIES.slice(0, 4).map((uni, idx) => (
                <div
                  key={uni.name}
                  className={`absolute w-72 transition-all duration-500 cursor-pointer ${idx === activeUniversity ? 'z-30 scale-100 opacity-100' : 'opacity-60 scale-90'
                    }`}
                  style={{
                    top: `${idx * 30 + 20}px`,
                    left: `${idx * 40}px`,
                    transform: idx === activeUniversity
                      ? 'translateX(0) rotate(0deg)'
                      : `translateX(${(idx - activeUniversity) * 20}px) rotate(${(idx - activeUniversity) * 3}deg)`,
                  }}
                  onMouseEnter={() => setActiveUniversity(idx)}
                >
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative bg-[#0f0a1f] rounded-2xl overflow-hidden border border-white/10">
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={uni.image}
                          alt={uni.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1f] via-transparent to-transparent" />
                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          #{uni.rank}
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-lg mb-1">{uni.name}</h4>
                        <p className="text-sm text-white/50 mb-3">{uni.fullName}</p>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <MapPin className="w-3 h-3" />
                          {uni.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Universities Section - Horizontal Scroll with Bento Grid */}
      <section id="universities" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-sm text-violet-400 font-medium tracking-wider uppercase">Explore</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-2">
                World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Institutions</span>
              </h2>
            </div>
            <Button variant="ghost" className="hidden md:flex text-white/60 hover:text-white group">
              View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {FEATURED_UNIVERSITIES.map((uni, idx) => (
              <div
                key={uni.name}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] ${idx === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'
                  }`}
              >
                <Image
                  src={uni.image}
                  alt={uni.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className={`absolute bottom-0 left-0 right-0 p-4 ${idx === 0 ? 'p-6' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded text-[10px] font-medium">
                      Rank #{uni.rank}
                    </span>
                  </div>
                  <h4 className={`font-bold ${idx === 0 ? 'text-2xl' : 'text-sm'}`}>{uni.fullName}</h4>
                  <p className="text-white/50 text-xs mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {uni.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disciplines - Pill Cloud */}
      <section id="disciplines" className="relative z-10 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-sm text-fuchsia-400 font-medium tracking-wider uppercase">Programs</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">Every Field</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              From cutting-edge tech to classical disciplines, find programs across 14+ fields of study
            </p>
          </div>

          {/* Floating Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {DISCIPLINES.map((disc, idx) => (
              <div
                key={disc.name}
                className="group relative"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-fuchsia-600/50 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative px-6 py-3 bg-[#0f0a1f] border border-white/10 rounded-full flex items-center gap-3 cursor-pointer hover:border-violet-500/50 transition-all group-hover:scale-105">
                  <span className="text-2xl">{disc.icon}</span>
                  <span className="font-medium">{disc.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries - Interactive World */}
      <section id="countries" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-sm text-cyan-400 font-medium tracking-wider uppercase">Destinations</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Global</span> Reach
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Access universities across 11 countries, each offering unique opportunities
            </p>
          </div>

          {/* Country Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COUNTRIES.map((country) => (
              <div
                key={country.name}
                className="group relative p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl cursor-pointer hover:border-cyan-500/30 transition-all hover:scale-[1.02]"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl mb-4">{country.flag}</div>
                <h4 className="font-bold text-lg mb-1">{country.name}</h4>
                <p className="text-sm text-white/40">{country.universities} Universities</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-[#1a0a2e] to-[#0a0a1a] border border-white/10 rounded-3xl p-12 md:p-16">
              <Zap className="w-12 h-12 mx-auto mb-6 text-violet-400" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Begin?
              </h2>
              <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto">
                Join thousands of students who found their perfect university match with our AI-powered platform.
              </p>
              <Button
                onClick={() => handleAuth('signup')}
                size="lg"
                className="relative group h-14 px-10 rounded-full text-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500" />
                <span className="relative flex items-center gap-2 font-semibold">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center">
              <Compass className="text-white w-5 h-5" />
            </div>
            <span className="font-bold">Clarity Compass</span>
          </div>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Clarity Compass. Built for the future of education.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-100 p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 rounded-3xl blur-xl opacity-50" />
            <div className="relative bg-[#0f0a1f] border border-white/10 rounded-3xl p-8">
              <button
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-2xl flex items-center justify-center">
                  {authMode === 'login' ? <BookOpen className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
                </div>
                <h2 className="text-2xl font-bold">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-white/50 text-sm mt-2">
                  {authMode === 'login' ? 'Continue your journey' : 'Start your study abroad adventure'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="mt-2 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="mt-2 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 mt-6 rounded-xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500" />
                  <span className="relative font-semibold">
                    {isLoading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </span>
                </Button>
              </form>

              <div className="mt-8 text-center text-sm border-t border-white/10 pt-6">
                <span className="text-white/50">
                  {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                </span>
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="ml-2 text-violet-400 hover:text-violet-300 font-semibold"
                >
                  {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
