'use client'

import { useState, useCallback, useEffect } from 'react'
import { Transaction, getTransactions } from '@/app/actions/transactions'
import TransactionList from '@/components/TransactionList'
import CategoryFilter from '@/components/CategoryFilter'

interface TransactionsClientWrapperProps {
    initialTransactions: Transaction[]
    currency?: string
    dateFormat?: string
}

export function TransactionsClientWrapper({
    initialTransactions,
    currency = 'INR',
    dateFormat = 'DD/MM/YYYY'
}: TransactionsClientWrapperProps) {
    const [transactions, setTransactions] = useState(initialTransactions)
    const [activeCategory, setActiveCategory] = useState('all')
    const [isLoading, setIsLoading] = useState(false)

    const refreshData = useCallback(async () => {
        setIsLoading(true)
        try {
            const result = await getTransactions(activeCategory)
            setTransactions(result.transactions)
        } finally {
            setIsLoading(false)
        }
    }, [activeCategory])

    useEffect(() => {
        refreshData()
    }, [activeCategory, refreshData])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <CategoryFilter
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />
                {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground/70 text-sm">
                        <svg className="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
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
                currency={currency}
                dateFormat={dateFormat}
            />
        </div>
    )
}
