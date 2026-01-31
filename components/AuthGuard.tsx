'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            const user = localStorage.getItem('user')
            const publicPaths = ['/']

            if (publicPaths.includes(pathname)) {
                // If on public page and logged in, redirect to dashboard
                if (user) {
                    router.push('/dashboard')
                } else {
                    setIsLoading(false)
                }
            } else {
                // If on protected page and not logged in, redirect to home
                if (!user) {
                    router.push('/')
                } else {
                    setIsLoading(false)
                }
            }
        }

        checkAuth()
    }, [pathname, router])

    // While checking auth on a protected route, show nothing or a loader
    if (isLoading && pathname !== '/') {
        return (
            <div className="flex bg-background items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return <>{children}</>
}
