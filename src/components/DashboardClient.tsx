'use client'

import { useState, useEffect, useCallback } from 'react'
import TransactionInput from '@/components/TransactionInput'
import TransactionList from '@/components/TransactionList'
import SummaryCards from '@/components/SummaryCards'
import CategoryFilter from '@/components/CategoryFilter'
import { getTransactions, getTransactionSummary, Transaction } from '@/app/actions/transactions'

interface DashboardClientProps {
    initialTransactions: Transaction[]
    initialSummary: {
        sales: number
        purchase: number
        expense: number
        income: number
    }
    currency?: string
    dateFormat?: string
}

export default function DashboardClient({
    initialTransactions,
    initialSummary,
    currency = 'INR',
    dateFormat = 'DD/MM/YYYY'
}: DashboardClientProps) {
    const [transactions, setTransactions] = useState(initialTransactions)
    const [summary, setSummary] = useState(initialSummary)
    const [activeCategory, setActiveCategory] = useState('all')
    const [isLoading, setIsLoading] = useState(false)

    const refreshData = useCallback(async () => {
        setIsLoading(true)
        try {
            const [transactionsResult, summaryResult] = await Promise.all([
                getTransactions(activeCategory),
                getTransactionSummary()
            ])
            setTransactions(transactionsResult.transactions)
            setSummary(summaryResult)
        } finally {
            setIsLoading(false)
        }
    }, [activeCategory])

    useEffect(() => {
        refreshData()
    }, [activeCategory, refreshData])

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category)
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <SummaryCards summary={summary} currency={currency} />

            {/* Transaction Input */}
            <TransactionInput onTransactionCreated={refreshData} />

            {/* Filter & List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <CategoryFilter
                        activeCategory={activeCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                    {isLoading && (
                        <div className="flex items-center gap-2 text-foreground/50 text-sm">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                        </div>
                    )}
                </div>

                <TransactionList
                    transactions={transactions}
                    onTransactionDeleted={refreshData}
                    limit={5}
                    showViewAll={true}
                    currency={currency}
                    dateFormat={dateFormat}
                />
            </div>
        </div>
    )
}
