import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTransactions, getTransactionSummary } from '@/app/actions/transactions'
import { getUserSettings } from '@/app/actions/settings'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch initial data and settings
    const [transactionsResult, summary, settingsResult] = await Promise.all([
        getTransactions(),
        getTransactionSummary(),
        getUserSettings()
    ])

    const settings = settingsResult.settings

    return (
        <>
            {/* Top Header */}
            <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                    <p className="text-sm text-foreground/50">AI-Powered Accounting</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-foreground/50 hover:text-foreground hover:bg-secondary rounded-lg transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold text-xs">
                            {user.email?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="p-8">
                <DashboardClient
                    initialTransactions={transactionsResult.transactions}
                    initialSummary={summary}
                    currency={settings?.currency || 'INR'}
                    dateFormat={settings?.date_format || 'DD/MM/YYYY'}
                />
            </main>
        </>
    )
}
