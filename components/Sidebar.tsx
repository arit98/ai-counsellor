'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    MessageSquare,
    Globe,
    CheckSquare,
    User,
    LogOut,
    X,
    Menu,
    Lock,
    Compass
} from 'lucide-react'
import { toast } from 'sonner'

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const activeTab = searchParams.get('tab') || 'overview'

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', id: 'overview' },
        { icon: MessageSquare, label: 'AI Counsellor', href: '/ai-counsellor', id: 'ai-counsellor' },
        { icon: Globe, label: 'Universities', href: '/universities', id: 'universities' },
        { icon: Lock, label: 'Locked Universities', href: '/locked-universities', id: 'locked' },
        { icon: CheckSquare, label: 'Applications', href: '/applications', id: 'applications' },
    ]

    const isActive = (item: any) => {
        if (item.id === 'overview') {
            return pathname === '/dashboard' && activeTab === 'overview'
        }
        return pathname.startsWith(item.href) && item.href !== '#'
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('profile')
        toast.success('Logged out successfully')
        setTimeout(() => {
            window.location.href = '/'
        }, 500)
    }

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-card/80 backdrop-blur-sm border border-border rounded-xl text-foreground shadow-lg hover:bg-card transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside className={`fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } z-50 w-64`}>

                {/* Cosmic glow effect */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="relative p-5 border-b border-sidebar-border flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                            <div className="relative w-10 h-10 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center">
                                <Compass className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div>
                            <span className="font-bold text-sidebar-foreground text-base">Clarity Compass</span>
                            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">AI Study Abroad</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden text-muted-foreground hover:text-foreground p-1.5 hover:bg-white/5 rounded-lg transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <Link key={item.id} href={item.href} onClick={() => setIsOpen(false)}>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start gap-3 px-4 py-5 text-sm font-medium transition-all duration-200 rounded-xl group relative overflow-hidden ${isActive(item)
                                    ? 'text-white'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                    }`}
                            >
                                {isActive(item) && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 opacity-90" />
                                )}
                                <item.icon className={`relative h-5 w-5 transition-transform group-hover:scale-110 ${isActive(item) ? 'text-white' : ''}`} />
                                <span className="relative">{item.label}</span>
                                {isActive(item) && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/50 rounded-l-full" />
                                )}
                            </Button>
                        </Link>
                    ))}
                </nav>

                {/* Footer User & Logout */}
                <div className="relative p-4 border-t border-sidebar-border">
                    {/* Cosmic bottom glow */}
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-cyan-600/5 to-transparent pointer-events-none" />

                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <div className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group mb-2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity" />
                                <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:border-violet-400 transition-colors">
                                    <User className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground">My Profile</span>
                                <span className="text-xs text-muted-foreground">View & edit</span>
                            </div>
                        </div>
                    </Link>

                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">Sign Out</span>
                    </Button>
                </div>
            </aside>
        </>
    )
}
