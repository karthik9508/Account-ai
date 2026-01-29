'use client'

import { Invoice } from '@/app/actions/invoices'

interface InvoicePreviewProps {
    invoice: Invoice
    currency?: string
}

const statusConfig = {
    draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
    sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700' },
    paid: { label: 'Paid', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
}

export default function InvoicePreview({ invoice, currency = 'INR' }: InvoicePreviewProps) {
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
            month: 'long',
            year: 'numeric'
        })
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Print Button - Hidden in print */}
            <div className="mb-6 flex justify-end gap-3 print:hidden">
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Invoice
                </button>
            </div>

            {/* Invoice Document */}
            <div className="bg-white text-gray-900 rounded-2xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 print:bg-blue-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">INVOICE</h1>
                            <p className="text-blue-100 font-mono text-lg">{invoice.invoice_number}</p>
                        </div>
                        <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig[invoice.status].color} print:bg-gray-100`}>
                                {statusConfig[invoice.status].label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Invoice Info */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
                            <p className="text-lg font-semibold text-gray-900">{invoice.customer_name}</p>
                            {invoice.customer_email && (
                                <p className="text-gray-600">{invoice.customer_email}</p>
                            )}
                            {invoice.customer_phone && (
                                <p className="text-gray-600">{invoice.customer_phone}</p>
                            )}
                            {invoice.customer_address && (
                                <p className="text-gray-600 mt-1">{invoice.customer_address}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Invoice Date</p>
                                <p className="font-semibold text-gray-900">{formatDate(invoice.invoice_date)}</p>
                            </div>
                            {invoice.due_date && (
                                <div>
                                    <p className="text-sm text-gray-500">Due Date</p>
                                    <p className="font-semibold text-gray-900">{formatDate(invoice.due_date)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                    <th className="text-center py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider w-24">Qty</th>
                                    <th className="text-right py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider w-32">Unit Price</th>
                                    <th className="text-right py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider w-32">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items && invoice.items.map((item, index) => (
                                    <tr key={item.id || index} className="border-b border-gray-100">
                                        <td className="py-4 text-gray-900">{item.description}</td>
                                        <td className="py-4 text-center text-gray-700">{item.quantity}</td>
                                        <td className="py-4 text-right text-gray-700">{formatCurrency(item.unit_price)}</td>
                                        <td className="py-4 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-72">
                            <div className="flex justify-between py-2 text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            {invoice.tax_rate > 0 && (
                                <div className="flex justify-between py-2 text-gray-600">
                                    <span>Tax ({invoice.tax_rate}%)</span>
                                    <span>{formatCurrency(invoice.tax_amount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-3 border-t-2 border-gray-200 mt-2">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-lg font-bold text-blue-600">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes</h3>
                            <p className="text-gray-600">{invoice.notes}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-500 border-t border-gray-200">
                    <p>Thank you for your business!</p>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .max-w-4xl, .max-w-4xl * {
                        visibility: visible;
                    }
                    .max-w-4xl {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        max-width: 100%;
                    }
                    @page {
                        margin: 0.5in;
                    }
                }
            `}</style>
        </div>
    )
}
