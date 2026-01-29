'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface InvoiceItem {
    id?: string
    invoice_id?: string
    description: string
    quantity: number
    unit_price: number
    amount: number
}

export interface Invoice {
    id: string
    user_id: string
    transaction_id: string | null
    invoice_number: string
    customer_name: string
    customer_email: string | null
    customer_phone: string | null
    customer_address: string | null
    invoice_date: string
    due_date: string | null
    subtotal: number
    tax_rate: number
    tax_amount: number
    total: number
    notes: string | null
    status: 'draft' | 'sent' | 'paid' | 'cancelled'
    created_at: string
    updated_at: string
    items?: InvoiceItem[]
}

export interface CreateInvoiceData {
    transaction_id?: string
    customer_name: string
    customer_email?: string
    customer_phone?: string
    customer_address?: string
    invoice_date: string
    due_date?: string
    tax_rate?: number
    notes?: string
    items: Omit<InvoiceItem, 'id' | 'invoice_id'>[]
}

// Generate next invoice number for user
export async function generateInvoiceNumber(): Promise<{ success: boolean; invoiceNumber?: string; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in' }
        }

        // Get the latest invoice number for this user
        const { data: latestInvoice } = await supabase
            .from('invoices')
            .select('invoice_number')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        let nextNumber = 1
        if (latestInvoice?.invoice_number) {
            // Extract number from format INV-XXX
            const match = latestInvoice.invoice_number.match(/INV-(\d+)/)
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1
            }
        }

        const invoiceNumber = `INV-${String(nextNumber).padStart(3, '0')}`
        return { success: true, invoiceNumber }
    } catch (error) {
        console.error('Generate invoice number error:', error)
        return { success: false, error: 'Failed to generate invoice number' }
    }
}

// Create a new invoice
export async function createInvoice(data: CreateInvoiceData): Promise<{ success: boolean; invoice?: Invoice; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in to create invoices' }
        }

        // Generate invoice number
        const { invoiceNumber, error: numError } = await generateInvoiceNumber()
        if (numError || !invoiceNumber) {
            return { success: false, error: numError || 'Failed to generate invoice number' }
        }

        // Calculate totals
        const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0)
        const taxRate = data.tax_rate || 0
        const taxAmount = subtotal * (taxRate / 100)
        const total = subtotal + taxAmount

        // Insert invoice
        const { data: invoice, error: insertError } = await supabase
            .from('invoices')
            .insert({
                user_id: user.id,
                transaction_id: data.transaction_id || null,
                invoice_number: invoiceNumber,
                customer_name: data.customer_name,
                customer_email: data.customer_email || null,
                customer_phone: data.customer_phone || null,
                customer_address: data.customer_address || null,
                invoice_date: data.invoice_date,
                due_date: data.due_date || null,
                subtotal,
                tax_rate: taxRate,
                tax_amount: taxAmount,
                total,
                notes: data.notes || null,
                status: 'draft'
            })
            .select()
            .single()

        if (insertError) {
            console.error('Insert invoice error:', insertError)
            return { success: false, error: 'Failed to create invoice' }
        }

        // Insert invoice items
        if (data.items.length > 0) {
            const itemsToInsert = data.items.map(item => ({
                invoice_id: invoice.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                amount: item.amount
            }))

            const { error: itemsError } = await supabase
                .from('invoice_items')
                .insert(itemsToInsert)

            if (itemsError) {
                console.error('Insert invoice items error:', itemsError)
                // Delete the invoice since items failed
                await supabase.from('invoices').delete().eq('id', invoice.id)
                return { success: false, error: 'Failed to create invoice items' }
            }
        }

        revalidatePath('/dashboard/invoices')
        return { success: true, invoice: invoice as Invoice }
    } catch (error) {
        console.error('Create invoice error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

// Get all invoices for the current user
export async function getInvoices(status?: string): Promise<{ invoices: Invoice[]; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { invoices: [], error: 'Please sign in to view invoices' }
        }

        let query = supabase
            .from('invoices')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (status && status !== 'all') {
            query = query.eq('status', status)
        }

        const { data, error } = await query

        if (error) {
            console.error('Get invoices error:', error)
            return { invoices: [], error: 'Failed to fetch invoices' }
        }

        return { invoices: (data || []) as Invoice[] }
    } catch (error) {
        console.error('Get invoices error:', error)
        return { invoices: [], error: 'An unexpected error occurred' }
    }
}

// Get single invoice with items
export async function getInvoiceById(id: string): Promise<{ success: boolean; invoice?: Invoice; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in' }
        }

        // Get invoice
        const { data: invoice, error: invoiceError } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (invoiceError) {
            console.error('Get invoice error:', invoiceError)
            return { success: false, error: 'Invoice not found' }
        }

        // Get invoice items
        const { data: items, error: itemsError } = await supabase
            .from('invoice_items')
            .select('*')
            .eq('invoice_id', id)
            .order('created_at', { ascending: true })

        if (itemsError) {
            console.error('Get invoice items error:', itemsError)
        }

        return {
            success: true,
            invoice: {
                ...invoice,
                items: items || []
            } as Invoice
        }
    } catch (error) {
        console.error('Get invoice error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

// Update invoice status
export async function updateInvoiceStatus(
    id: string,
    status: 'draft' | 'sent' | 'paid' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in' }
        }

        const { error } = await supabase
            .from('invoices')
            .update({ 
                status, 
                updated_at: new Date().toISOString() 
            })
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Update invoice status error:', error)
            return { success: false, error: 'Failed to update invoice status' }
        }

        revalidatePath('/dashboard/invoices')
        return { success: true }
    } catch (error) {
        console.error('Update invoice status error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

// Delete invoice
export async function deleteInvoice(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in' }
        }

        const { error } = await supabase
            .from('invoices')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Delete invoice error:', error)
            return { success: false, error: 'Failed to delete invoice' }
        }

        revalidatePath('/dashboard/invoices')
        return { success: true }
    } catch (error) {
        console.error('Delete invoice error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

// Get transaction details for invoice creation
export async function getTransactionForInvoice(transactionId: string): Promise<{
    success: boolean
    transaction?: {
        id: string
        description: string
        amount: number
        party_name: string | null
        created_at: string
    }
    error?: string
}> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in' }
        }

        const { data, error } = await supabase
            .from('transactions')
            .select('id, description, amount, party_name, created_at')
            .eq('id', transactionId)
            .eq('user_id', user.id)
            .eq('category', 'sales')
            .single()

        if (error) {
            console.error('Get transaction error:', error)
            return { success: false, error: 'Transaction not found' }
        }

        return { success: true, transaction: data }
    } catch (error) {
        console.error('Get transaction error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}
