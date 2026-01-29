import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SidebarNav from '@/components/SidebarNav'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Side Navbar */}
            <aside className="w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <Link href="/" className="text-xl font-bold text-primary">
                        Account AI
                    </Link>
                </div>

                {/* Navigation Links */}
                <SidebarNav userEmail={user.email || ''} />

                {/* User Section */}
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                                {user.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                            <p className="text-xs text-foreground/50">Beta Version</p>
                        </div>
                    </div>
                    <form action={signout}>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground/70 font-medium hover:bg-secondary/80 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {children}
            </div>
        </div>
    )
}
