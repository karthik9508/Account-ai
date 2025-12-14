'use client'

import { useState } from 'react'
import { Transaction, deleteTransaction } from '@/app/actions/transactions'
import Link from 'next/link'
import EditTransactionModal from './EditTransactionModal'
import ConfirmModal from './ConfirmModal'
import { formatCurrency, formatDate } from '@/lib/utils/currency'

interface TransactionListProps {
    transactions: Transaction[]
    onTransactionDeleted?: () => void
    onTransactionUpdated?: () => void
    limit?: number
    showViewAll?: boolean
    currency?: string
    dateFormat?: string
}

const categoryConfig = {
    sales: { label: 'Sales', color: 'bg-green-100 text-green-700', icon: '📈' },
    purchase: { label: 'Purchase', color: 'bg-orange-100 text-orange-700', icon: '🛒' },
    expense: { label: 'Expense', color: 'bg-red-100 text-red-700', icon: '💸' },
    income: { label: 'Income', color: 'bg-blue-100 text-blue-700', icon: '💰' }
}

export default function TransactionList({
    transactions,
    onTransactionDeleted,
    onTransactionUpdated,
    limit,
    showViewAll = false,
    currency = 'INR',
    dateFormat = 'DD/MM/YYYY'
}: TransactionListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

    // Apply limit if specified
    const displayTransactions = limit ? transactions.slice(0, limit) : transactions
    const hasMore = limit ? transactions.length > limit : false

    // Get transaction being deleted for display
    const transactionToDelete = transactions.find(t => t.id === deleteConfirmId)

    const handleDeleteClick = (id: string) => {
        setDeleteConfirmId(id)
    }

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmId) return

        setDeletingId(deleteConfirmId)

        try {
            const result = await deleteTransaction(deleteConfirmId)

            if (result.success) {
                setDeleteConfirmId(null)
                onTransactionDeleted?.()
            } else {
                alert(result.error || 'Failed to delete transaction')
            }
        } catch (err) {
            console.error('Delete error:', err)
            alert('An unexpected error occurred while deleting')
        } finally {
            setDeletingId(null)
        }
    }

    const handleDeleteCancel = () => {
        setDeleteConfirmId(null)
    }

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction)
    }

    const handleEditClose = () => {
        setEditingTransaction(null)
    }

    const handleEditSuccess = () => {
        onTransactionUpdated?.()
        onTransactionDeleted?.()
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">No Transactions Found</h3>
                <p className="text-gray-500 text-sm">No transactions match the current filter</p>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-black">
                        {limit ? 'Recent Transactions' : `Transactions (${transactions.length})`}
                    </h3>
                    {showViewAll && hasMore && (
                        <Link
                            href="/dashboard/transactions"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            View All
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}
                </div>
                <div className="divide-y divide-gray-100">
                    {displayTransactions.map((transaction) => {
                        const config = categoryConfig[transaction.category]
                        return (
                            <div
                                key={transaction.id}
                                className="px-6 py-4 hover:bg-gray-50 transition-all group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="text-2xl">{config.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
                                                    {config.label}
                                                </span>
                                                {transaction.party_name && (
                                                    <span className="text-xs text-gray-500">
                                                        • {transaction.party_name}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-black font-medium truncate">{transaction.description}</p>
                                            <p className="text-xs text-gray-400 mt-1">{formatDate(transaction.created_at, dateFormat)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-lg font-semibold ${transaction.category === 'sales' || transaction.category === 'income'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`}>
                                            {transaction.category === 'sales' || transaction.category === 'income' ? '+' : '-'}
                                            {formatCurrency(transaction.amount, currency)}
                                        </span>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => handleEdit(transaction)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit transaction"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteClick(transaction.id)}
                                                disabled={deletingId === transaction.id}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete transaction"
                                            >
                                                {deletingId === transaction.id ? (
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {showViewAll && hasMore && (
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                        <Link
                            href="/dashboard/transactions"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            +{transactions.length - (limit || 0)} more transactions
                        </Link>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteConfirmId}
                title="Delete Transaction"
                message={transactionToDelete
                    ? `Are you sure you want to delete "${transactionToDelete.description}" (${formatCurrency(transactionToDelete.amount, currency)})?`
                    : 'Are you sure you want to delete this transaction?'
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                isLoading={!!deletingId}
            />

            {/* Edit Modal */}
            {editingTransaction && (
                <EditTransactionModal
                    transaction={editingTransaction}
                    isOpen={true}
                    onClose={handleEditClose}
                    onUpdated={handleEditSuccess}
                />
            )}
        </>
    )
}
