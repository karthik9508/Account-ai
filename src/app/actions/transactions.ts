'use server'

import { createClient } from '@/lib/supabase/server'
import { analyzeTransaction, TransactionAnalysis } from '@/lib/gemini/ai'
import { revalidatePath } from 'next/cache'

export interface Transaction {
    id: string
    user_id: string
    category: 'sales' | 'purchase' | 'expense' | 'income'
    description: string
    amount: number
    original_prompt: string
    party_name: string | null
    created_at: string
}

// New function to just analyze without saving
export async function analyzeTransactionPrompt(prompt: string): Promise<{
    success: boolean
    analysis?: TransactionAnalysis
    error?: string
}> {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in to record transactions' }
        }

        // Analyze the transaction with AI
        const analysis = await analyzeTransaction(prompt)
        return { success: true, analysis }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to analyze transaction. Please try again.'
        return { success: false, error: errorMessage }
    }
}

// Save a pre-analyzed transaction
export async function saveTransaction(
    prompt: string,
    analysis: TransactionAnalysis,
    customDate?: string
): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in to record transactions' }
        }

        // Insert into database
        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                category: analysis.category,
                description: analysis.description,
                amount: analysis.amount,
                original_prompt: prompt,
                party_name: analysis.party_name,
                created_at: customDate ? new Date(customDate).toISOString() : new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            console.error('Database error:', error)
            return { success: false, error: 'Failed to save transaction. Please try again.' }
        }

        revalidatePath('/dashboard')
        return { success: true, transaction: data as Transaction }
    } catch (error) {
        console.error('Save transaction error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

// Keep the old function for backwards compatibility
export async function createTransaction(prompt: string): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in to record transactions' }
        }

        // Analyze the transaction with AI
        let analysis: TransactionAnalysis
        try {
            analysis = await analyzeTransaction(prompt)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to analyze transaction. Please try again.'
            return { success: false, error: errorMessage }
        }

        // Insert into database
        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                category: analysis.category,
                description: analysis.description,
                amount: analysis.amount,
                original_prompt: prompt,
                party_name: analysis.party_name
            })
            .select()
            .single()

        if (error) {
            console.error('Database error:', error)
            return { success: false, error: 'Failed to save transaction. Please try again.' }
        }

        revalidatePath('/dashboard')
        return { success: true, transaction: data as Transaction }
    } catch (error) {
        console.error('Create transaction error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

export async function getTransactions(category?: string): Promise<{ transactions: Transaction[]; error?: string }> {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { transactions: [], error: 'Please sign in to view transactions' }
        }

        // Build query
        let query = supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        // Filter by category if specified
        if (category && category !== 'all') {
            query = query.eq('category', category)
        }

        const { data, error } = await query

        if (error) {
            console.error('Database error:', error)
            return { transactions: [], error: 'Failed to fetch transactions' }
        }

        return { transactions: (data || []) as Transaction[] }
    } catch (error) {
        console.error('Get transactions error:', error)
        return { transactions: [], error: 'An unexpected error occurred' }
    }
}

export async function deleteTransaction(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in to delete transactions' }
        }

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id) // Ensure user owns this transaction

        if (error) {
            console.error('Database error:', error)
            return { success: false, error: 'Failed to delete transaction' }
        }

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/transactions')
        return { success: true }
    } catch (error) {
        console.error('Delete transaction error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

export interface UpdateTransactionData {
    category: 'sales' | 'purchase' | 'expense' | 'income'
    description: string
    amount: number
    party_name: string | null
    created_at?: string
}

export async function updateTransaction(
    id: string,
    data: UpdateTransactionData
): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in to update transactions' }
        }

        const updateData: Record<string, unknown> = {
            category: data.category,
            description: data.description,
            amount: data.amount,
            party_name: data.party_name || null
        }

        if (data.created_at) {
            updateData.created_at = new Date(data.created_at).toISOString()
        }

        const { data: updated, error } = await supabase
            .from('transactions')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            console.error('Database error:', error)
            return { success: false, error: 'Failed to update transaction' }
        }

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/transactions')
        return { success: true, transaction: updated as Transaction }
    } catch (error) {
        console.error('Update transaction error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

export async function getTransactionSummary(): Promise<{
    sales: number
    purchase: number
    expense: number
    income: number
}> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { sales: 0, purchase: 0, expense: 0, income: 0 }
    }

    const { data } = await supabase
        .from('transactions')
        .select('category, amount')
        .eq('user_id', user.id)

    const summary = { sales: 0, purchase: 0, expense: 0, income: 0 }

    if (data) {
        data.forEach((t: { category: keyof typeof summary; amount: number }) => {
            if (summary.hasOwnProperty(t.category)) {
                summary[t.category] += t.amount
            }
        })
    }

    return summary
}
