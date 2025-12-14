'use server'

import { createClient } from '@/lib/supabase/server'

export interface ReportData {
    // Period info
    startDate: string
    endDate: string

    // Income Statement (P&L)
    totalSales: number
    totalIncome: number
    totalRevenue: number // sales + income

    totalPurchases: number
    totalExpenses: number
    totalCosts: number // purchases + expenses

    grossProfit: number // sales - purchases
    netProfit: number // revenue - costs

    // Category breakdown
    salesByCategory: { category: string; amount: number; count: number }[]
    expensesByCategory: { description: string; amount: number }[]

    // Monthly trends
    monthlyData: {
        month: string
        sales: number
        income: number
        purchases: number
        expenses: number
        netProfit: number
    }[]

    // Top items
    topTransactions: {
        id: string
        description: string
        amount: number
        category: string
        date: string
    }[]
}

export async function getReportData(
    startDate?: string,
    endDate?: string
): Promise<{ success: boolean; data?: ReportData; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in to view reports' }
        }

        // Default to current month if no dates provided
        const now = new Date()
        const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

        const start = startDate || defaultStart
        const end = endDate || defaultEnd

        // Fetch all transactions for the period
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', start)
            .lte('created_at', end + 'T23:59:59')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Database error:', error)
            return { success: false, error: 'Failed to fetch report data' }
        }

        const txns = transactions || []

        // Calculate totals
        const totalSales = txns.filter(t => t.category === 'sales').reduce((sum, t) => sum + Number(t.amount), 0)
        const totalIncome = txns.filter(t => t.category === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
        const totalPurchases = txns.filter(t => t.category === 'purchase').reduce((sum, t) => sum + Number(t.amount), 0)
        const totalExpenses = txns.filter(t => t.category === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

        const totalRevenue = totalSales + totalIncome
        const totalCosts = totalPurchases + totalExpenses
        const grossProfit = totalSales - totalPurchases
        const netProfit = totalRevenue - totalCosts

        // Group expenses by description
        const expenseGroups: Record<string, number> = {}
        txns.filter(t => t.category === 'expense').forEach(t => {
            const key = t.description.substring(0, 30)
            expenseGroups[key] = (expenseGroups[key] || 0) + Number(t.amount)
        })
        const expensesByCategory = Object.entries(expenseGroups)
            .map(([description, amount]) => ({ description, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10)

        // Category breakdown
        const categoryData = [
            { category: 'Sales', amount: totalSales, count: txns.filter(t => t.category === 'sales').length },
            { category: 'Income', amount: totalIncome, count: txns.filter(t => t.category === 'income').length },
            { category: 'Purchases', amount: totalPurchases, count: txns.filter(t => t.category === 'purchase').length },
            { category: 'Expenses', amount: totalExpenses, count: txns.filter(t => t.category === 'expense').length },
        ]

        // Monthly trends
        const monthlyGroups: Record<string, { sales: number; income: number; purchases: number; expenses: number }> = {}
        txns.forEach(t => {
            const monthKey = new Date(t.created_at).toISOString().substring(0, 7) // YYYY-MM
            if (!monthlyGroups[monthKey]) {
                monthlyGroups[monthKey] = { sales: 0, income: 0, purchases: 0, expenses: 0 }
            }
            monthlyGroups[monthKey][t.category as keyof typeof monthlyGroups[string]] += Number(t.amount)
        })

        const monthlyData = Object.entries(monthlyGroups)
            .map(([month, data]) => ({
                month,
                ...data,
                netProfit: (data.sales + data.income) - (data.purchases + data.expenses)
            }))
            .sort((a, b) => a.month.localeCompare(b.month))

        // Top transactions by amount
        const topTransactions = txns
            .sort((a, b) => Number(b.amount) - Number(a.amount))
            .slice(0, 5)
            .map(t => ({
                id: t.id,
                description: t.description,
                amount: Number(t.amount),
                category: t.category,
                date: t.created_at
            }))

        return {
            success: true,
            data: {
                startDate: start,
                endDate: end,
                totalSales,
                totalIncome,
                totalRevenue,
                totalPurchases,
                totalExpenses,
                totalCosts,
                grossProfit,
                netProfit,
                salesByCategory: categoryData,
                expensesByCategory,
                monthlyData,
                topTransactions
            }
        }
    } catch (error) {
        console.error('Report error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}
