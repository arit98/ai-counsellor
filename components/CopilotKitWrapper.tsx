'use client'

import { useState, useEffect } from "react";
import { CopilotKit, useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import dynamic from 'next/dynamic';
import "@copilotkit/react-ui/styles.css";
import { useRouter } from "next/navigation";

const CopilotPopup = dynamic(
    () => import('@copilotkit/react-ui').then((mod) => mod.CopilotPopup),
    { ssr: false }
);

function CopilotHooks() {
    const router = useRouter();

    // Global navigation action
    useCopilotAction({
        name: "navigate",
        description: "Navigate to a specific page in the application",
        parameters: [
            {
                name: "page",
                type: "string",
                description: "The name of the page to navigate to ('dashboard', 'counsellor', 'universities', 'applications', 'profile')",
                required: true,
            },
        ],
        handler: ({ page }) => {
            const routes: Record<string, string> = {
                dashboard: "/dashboard",
                counsellor: "/counsellor",
                universities: "/universities",
                applications: "/applications",
                profile: "/dashboard?tab=profile",
            };
            if (routes[page]) {
                router.push(routes[page]);
            }
        },
    });

    // Provide profile context to Copilot
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfileContext = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user._id) {
                        const res = await fetch(`/api/profile?userId=${user._id}`);
                        const data = await res.json();
                        if (data && !data.error) {
                            setUserProfile(data);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching profile for Copilot:", error);
            }
        };

        fetchProfileContext();
    }, []);

    useCopilotReadable({
        description: "The current user's profile information. Use this to give personalized recommendations.",
        value: userProfile,
    });

    useCopilotReadable({
        description: "Overview of the application pages",
        value: "The app has a dashboard, an AI counsellor chat page, a university discovery page, and an application tracker.",
    });

    return null;
}

export default function CopilotKitWrapper({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <CopilotKit runtimeUrl="/api/copilotkit">
            <CopilotHooks />
            {children}
            {isMounted && (
                <CopilotPopup
                    instructions="You are an expert AI Study Abroad Counsellor. Help students find universities, understand application processes, and give career advice. You can navigate the user to different pages if they ask."
                    labels={{
                        title: "AI Assistant",
                        initial: "Hi! I'm your AI counsellor. How can I help you with your study abroad plans today?",
                    }}
                    defaultOpen={false}
                    clickOutsideToClose={true}
                />
            )}
        </CopilotKit>
    );
}
