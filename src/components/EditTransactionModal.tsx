'use client'

import { useState } from 'react'
import { Transaction, updateTransaction, UpdateTransactionData } from '@/app/actions/transactions'

interface EditTransactionModalProps {
    transaction: Transaction
    isOpen: boolean
    onClose: () => void
    onUpdated: () => void
}

const categoryConfig = {
    sales: { label: 'Sales', color: 'bg-green-100 text-green-700 border-green-200', icon: '📈' },
    purchase: { label: 'Purchase', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🛒' },
    expense: { label: 'Expense', color: 'bg-red-100 text-red-700 border-red-200', icon: '💸' },
    income: { label: 'Income', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '💰' }
}

export default function EditTransactionModal({
    transaction,
    isOpen,
    onClose,
    onUpdated
}: EditTransactionModalProps) {
    const [formData, setFormData] = useState<UpdateTransactionData>({
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount,
        party_name: transaction.party_name,
        created_at: transaction.created_at.split('T')[0]
    })
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.description.trim()) {
            setError('Description is required')
            return
        }
        if (formData.amount <= 0) {
            setError('Amount must be greater than 0')
            return
        }

        setIsSaving(true)
        setError(null)

        try {
            const result = await updateTransaction(transaction.id, formData)
            if (result.success) {
                onUpdated()
                onClose()
            } else {
                setError(result.error || 'Failed to update transaction')
            }
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setIsSaving(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-black">Edit Transaction</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Category Selection */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                        <div className="flex gap-2">
                            {(['sales', 'purchase', 'expense', 'income'] as const).map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${formData.category === cat
                                            ? categoryConfig[cat].color
                                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {categoryConfig[cat].icon} {categoryConfig[cat].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Transaction description"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Amount (₹)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="0"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Party Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Party Name (optional)</label>
                        <input
                            type="text"
                            value={formData.party_name || ''}
                            onChange={(e) => setFormData({ ...formData, party_name: e.target.value || null })}
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Customer or vendor name"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
                        <input
                            type="date"
                            value={formData.created_at}
                            onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Summary */}
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className={`text-sm px-2 py-0.5 rounded-full font-medium border ${categoryConfig[formData.category].color}`}>
                                {categoryConfig[formData.category].icon} {categoryConfig[formData.category].label}
                            </span>
                            <span className={`text-lg font-bold ${formData.category === 'sales' || formData.category === 'income'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}>
                                {formData.category === 'sales' || formData.category === 'income' ? '+' : '-'}
                                {formatCurrency(formData.amount)}
                            </span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 py-2.5 px-4 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
