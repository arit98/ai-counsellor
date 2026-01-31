'use client'

import { DashboardShell } from '@/components/DashboardShell'
import { Card } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export default function AICounsellorPage() {
    return (
        <DashboardShell title="AI Counsellor">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                    <MessageSquare className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold">AI Counsellor Chat</h2>
                <p className="text-muted-foreground max-w-md">
                    Chat with our AI to get personalized guidance on your university application journey.
                </p>
                <Card className="p-8 w-full max-w-2xl border-dashed">
                    <p className="text-sm text-muted-foreground">Chat interface coming soon...</p>
                </Card>
            </div>
        </DashboardShell>
    )
}
