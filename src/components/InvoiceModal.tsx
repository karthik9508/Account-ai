'use client'

import { useState, useEffect } from 'react'
import { createInvoice, CreateInvoiceData, InvoiceItem } from '@/app/actions/invoices'
import { Transaction } from '@/app/actions/transactions'

interface InvoiceModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: Transaction
    currency?: string
    onInvoiceCreated?: () => void
}

export default function InvoiceModal({
    isOpen,
    onClose,
    transaction,
    currency = 'INR',
    onInvoiceCreated
}: InvoiceModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Form state
    const [customerName, setCustomerName] = useState(transaction.party_name || '')
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerPhone, setCustomerPhone] = useState('')
    const [customerAddress, setCustomerAddress] = useState('')
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
    const [dueDate, setDueDate] = useState('')
    const [taxRate, setTaxRate] = useState(0)
    const [notes, setNotes] = useState('')
    const [items, setItems] = useState<Omit<InvoiceItem, 'id' | 'invoice_id'>[]>([
        {
            description: transaction.description,
            quantity: 1,
            unit_price: transaction.amount,
            amount: transaction.amount
        }
    ])

    // Reset form when transaction changes
    useEffect(() => {
        if (transaction) {
            setCustomerName(transaction.party_name || '')
            setItems([
                {
                    description: transaction.description,
                    quantity: 1,
                    unit_price: transaction.amount,
                    amount: transaction.amount
                }
            ])
        }
    }, [transaction])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount)
    }

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + item.amount, 0)
    }

    const calculateTax = () => {
        return calculateSubtotal() * (taxRate / 100)
    }

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax()
    }

    const updateItem = (index: number, field: keyof Omit<InvoiceItem, 'id' | 'invoice_id'>, value: string | number) => {
        const newItems = [...items]
        if (field === 'description') {
            newItems[index].description = value as string
        } else {
            const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value
            if (field === 'quantity') {
                newItems[index].quantity = numValue
                newItems[index].amount = numValue * newItems[index].unit_price
            } else if (field === 'unit_price') {
                newItems[index].unit_price = numValue
                newItems[index].amount = newItems[index].quantity * numValue
            } else if (field === 'amount') {
                newItems[index].amount = numValue
            }
        }
        setItems(newItems)
    }

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unit_price: 0, amount: 0 }])
    }

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        if (!customerName.trim()) {
            setError('Customer name is required')
            setIsLoading(false)
            return
        }

        if (items.length === 0 || items.every(item => item.amount === 0)) {
            setError('At least one item with amount is required')
            setIsLoading(false)
            return
        }

        const invoiceData: CreateInvoiceData = {
            transaction_id: transaction.id,
            customer_name: customerName,
            customer_email: customerEmail || undefined,
            customer_phone: customerPhone || undefined,
            customer_address: customerAddress || undefined,
            invoice_date: invoiceDate,
            due_date: dueDate || undefined,
            tax_rate: taxRate,
            notes: notes || undefined,
            items: items.filter(item => item.description && item.amount > 0)
        }

        const result = await createInvoice(invoiceData)

        if (result.success) {
            setSuccess(true)
            setTimeout(() => {
                onInvoiceCreated?.()
                onClose()
            }, 1500)
        } else {
            setError(result.error || 'Failed to create invoice')
        }

        setIsLoading(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-slate-700">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Create Invoice</h2>
                            <p className="text-blue-100 text-sm mt-1">Generate invoice for this sales transaction</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Invoice Created!</h3>
                        <p className="text-slate-400">Your invoice has been generated successfully.</p>
                    </div>
                )}

                {/* Form */}
                {!success && (
                    <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-80px)]">
                        <div className="p-6 space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Customer Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Customer Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">
                                            Customer Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter customer name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="customer@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={customerAddress}
                                            onChange={(e) => setCustomerAddress(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Customer address"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Invoice Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Invoice Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Invoice Date</label>
                                        <input
                                            type="date"
                                            value={invoiceDate}
                                            onChange={(e) => setInvoiceDate(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={taxRate}
                                            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Items</h3>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Item
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                            <div className="grid grid-cols-12 gap-3 items-end">
                                                <div className="col-span-12 md:col-span-5">
                                                    <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Item description"
                                                    />
                                                </div>
                                                <div className="col-span-4 md:col-span-2">
                                                    <label className="block text-xs font-medium text-slate-400 mb-1">Qty</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="col-span-4 md:col-span-2">
                                                    <label className="block text-xs font-medium text-slate-400 mb-1">Unit Price</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.unit_price}
                                                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="col-span-3 md:col-span-2">
                                                    <label className="block text-xs font-medium text-slate-400 mb-1">Amount</label>
                                                    <div className="px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-lg text-white text-sm">
                                                        {formatCurrency(item.amount)}
                                                    </div>
                                                </div>
                                                <div className="col-span-1">
                                                    {items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(calculateSubtotal())}</span>
                                    </div>
                                    {taxRate > 0 && (
                                        <div className="flex justify-between text-slate-400">
                                            <span>Tax ({taxRate}%)</span>
                                            <span>{formatCurrency(calculateTax())}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-slate-600">
                                        <span>Total</span>
                                        <span className="text-blue-400">{formatCurrency(calculateTotal())}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Notes (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Additional notes for the invoice..."
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-800/50 border-t border-slate-700 px-6 py-4 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                                Skip for Now
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Create Invoice
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
