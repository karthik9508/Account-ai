import { createClient } from '@/lib/supabase/server'
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
        <>
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
        </>
    )
}
