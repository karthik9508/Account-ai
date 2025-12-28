import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTransactions, getTransactionSummary } from '@/app/actions/transactions'
import { getUserSettings } from '@/app/actions/settings'
import { TransactionsClientWrapper } from '@/components/TransactionsClientWrapper'
import { formatCurrency } from '@/lib/utils/currency'

export default async function TransactionsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const [{ transactions }, summary, { settings }] = await Promise.all([
        getTransactions(),
        getTransactionSummary(),
        getUserSettings()
    ])

    const currency = settings?.currency || 'INR'
    const dateFormat = settings?.date_format || 'DD/MM/YYYY'

    const formatAmount = (amount: number) => formatCurrency(amount, currency)

    return (

        <div className="min-h-screen bg-background flex">
            {/* Side Navbar */}
            <aside className="w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Account AI
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-secondary hover:text-foreground font-medium transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </Link>

                    <Link
                        href="/dashboard/transactions"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary text-primary font-medium transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Transactions
                    </Link>

                    <Link
                        href="/dashboard/reports"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-secondary hover:text-foreground font-medium transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Reports
                    </Link>

                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-secondary hover:text-foreground font-medium transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                    </Link>
                </nav>

                {/* User Section */}
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
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
                {/* Top Header */}
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">All Transactions</h1>
                        <p className="text-sm text-muted-foreground">{transactions.length} transactions</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Transaction
                    </Link>
                </header>

                {/* Main Content Area */}
                <main className="p-8">
                    {/* Quick Summary */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-card rounded-xl border border-border p-4">
                            <p className="text-sm text-muted-foreground">Total Sales</p>
                            <p className="text-xl font-bold text-green-600">{formatAmount(summary.sales)}</p>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-4">
                            <p className="text-sm text-muted-foreground">Total Income</p>
                            <p className="text-xl font-bold text-blue-600">{formatAmount(summary.income)}</p>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-4">
                            <p className="text-sm text-muted-foreground">Total Purchases</p>
                            <p className="text-xl font-bold text-orange-600">{formatAmount(summary.purchase)}</p>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-4">
                            <p className="text-sm text-muted-foreground">Total Expenses</p>
                            <p className="text-xl font-bold text-red-600">{formatAmount(summary.expense)}</p>
                        </div>
                    </div>

                    {/* Transactions List with Filtering */}
                    <TransactionsClientWrapper
                        initialTransactions={transactions}
                        currency={currency}
                        dateFormat={dateFormat}
                    />
                </main>
            </div>
        </div>
    )
}
