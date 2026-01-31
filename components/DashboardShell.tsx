'use client'

import React from 'react'
import { Sidebar } from './Sidebar'
import { Compass } from 'lucide-react'

interface DashboardShellProps {
    children: React.ReactNode
    title?: string
    profile?: any
}

export function DashboardShell({ children, title, profile }: DashboardShellProps) {
    return (
        <div className="flex min-h-screen bg-background relative overflow-hidden">
            {/* Cosmic Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/15 via-purple-600/10 to-transparent blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-blue-600/8 to-transparent blur-[80px]" />
                <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-fuchsia-500/5 to-pink-500/5 blur-[60px]" />

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col min-h-screen md:ml-64 w-full relative z-10">
                {/* Main Content */}
                <div className="flex-1 flex flex-col w-full overflow-hidden">
                    {/* Top Bar / Header */}
                    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-border bg-card/60 backdrop-blur-xl">
                        <div className="flex items-center gap-3 pl-12 md:pl-0">
                            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-violet-500 to-cyan-500" />
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                {title || 'Dashboard'}
                            </h1>
                        </div>

                        {profile && (
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-foreground">
                                        {profile.firstName} {profile.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{profile.citizenship}</p>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity" />
                                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">
                                        {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
