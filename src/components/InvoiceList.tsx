'use client'

import { useState, useEffect } from 'react'
import { getInvoices, deleteInvoice, updateInvoiceStatus, Invoice } from '@/app/actions/invoices'
import Link from 'next/link'
import ConfirmModal from './ConfirmModal'

interface InvoiceListProps {
    currency?: string
}

const statusConfig = {
    draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    paid: { label: 'Paid', color: 'bg-green-100 text-green-700 border-green-200' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' }
}

export default function InvoiceList({ currency = 'INR' }: InvoiceListProps) {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState('all')
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const loadInvoices = async () => {
        setIsLoading(true)
        const result = await getInvoices(statusFilter)
        if (result.error) {
            setError(result.error)
        } else {
            setInvoices(result.invoices)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        loadInvoices()
    }, [statusFilter])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const handleStatusChange = async (id: string, newStatus: 'draft' | 'sent' | 'paid' | 'cancelled') => {
        const result = await updateInvoiceStatus(id, newStatus)
        if (result.success) {
            loadInvoices()
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        const result = await deleteInvoice(deleteId)
        if (result.success) {
            loadInvoices()
        }
        setIsDeleting(false)
        setDeleteId(null)
    }

    if (isLoading) {
        return (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-foreground/50">Loading invoices...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 text-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Invoices</h3>
                            <p className="text-sm text-foreground/50">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {['all', 'draft', 'sent', 'paid', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${statusFilter === status
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-foreground/70 hover:bg-secondary/80'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Invoice List */}
            {invoices.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-foreground/50 mb-2">No invoices found</p>
                    <p className="text-sm text-foreground/40">Create a sales transaction to generate an invoice</p>
                </div>
            ) : (
                <div className="divide-y divide-border">
                    {invoices.map((invoice) => (
                        <div key={invoice.id} className="p-4 hover:bg-secondary/30 transition-colors">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-mono font-semibold text-primary">{invoice.invoice_number}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${statusConfig[invoice.status].color}`}>
                                            {statusConfig[invoice.status].label}
                                        </span>
                                    </div>
                                    <p className="font-medium text-foreground truncate">{invoice.customer_name}</p>
                                    <p className="text-sm text-foreground/50">{formatDate(invoice.invoice_date)}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-bold text-foreground">{formatCurrency(invoice.total)}</p>
                                    {invoice.due_date && (
                                        <p className="text-xs text-foreground/50">Due: {formatDate(invoice.due_date)}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Status Dropdown */}
                                    <select
                                        value={invoice.status}
                                        onChange={(e) => handleStatusChange(invoice.id, e.target.value as 'draft' | 'sent' | 'paid' | 'cancelled')}
                                        className="text-xs px-2 py-1.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="sent">Sent</option>
                                        <option value="paid">Paid</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>

                                    {/* View Button */}
                                    <Link
                                        href={`/dashboard/invoices/${invoice.id}`}
                                        className="p-2 rounded-lg hover:bg-primary/10 text-foreground/50 hover:text-primary transition-colors"
                                        title="View Invoice"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </Link>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => setDeleteId(invoice.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-foreground/50 hover:text-red-500 transition-colors"
                                        title="Delete Invoice"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteId}
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Invoice"
                message="Are you sure you want to delete this invoice? This action cannot be undone."
                confirmText="Delete"
                isLoading={isDeleting}
            />
        </div>
    )
}
