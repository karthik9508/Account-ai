'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function exportTransactionsCSV(): Promise<{ success: boolean; csv?: string; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in' }
        }

        // Fetch all transactions
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Export error:', error)
            return { success: false, error: 'Failed to fetch transactions' }
        }

        if (!transactions || transactions.length === 0) {
            return { success: false, error: 'No transactions to export' }
        }

        // Create CSV content
        const headers = ['Date', 'Category', 'Description', 'Amount', 'Party Name']
        const rows = transactions.map(t => [
            new Date(t.created_at).toLocaleDateString('en-IN'),
            t.category,
            `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
            t.amount,
            t.party_name ? `"${t.party_name.replace(/"/g, '""')}"` : ''
        ])

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

        return { success: true, csv }
    } catch (error) {
        console.error('Export error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

export async function deleteUserAccount(): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in' }
        }

        // Delete all user's transactions
        const { error: txnError } = await supabase
            .from('transactions')
            .delete()
            .eq('user_id', user.id)

        if (txnError) {
            console.error('Delete transactions error:', txnError)
            return { success: false, error: 'Failed to delete transactions' }
        }

        // Delete user's settings
        const { error: settingsError } = await supabase
            .from('user_settings')
            .delete()
            .eq('user_id', user.id)

        if (settingsError) {
            console.error('Delete settings error:', settingsError)
            // Continue anyway, not critical
        }

        // Sign out the user (account deletion from auth.users requires admin API)
        await supabase.auth.signOut()

        return { success: true }
    } catch (error) {
        console.error('Delete account error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

export async function deleteAccountAndRedirect() {
    const result = await deleteUserAccount()
    if (result.success) {
        redirect('/login')
    }
    return result
}
