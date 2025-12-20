'use client'

import { useState } from 'react'
import { analyzeTransactionPrompt, saveTransaction } from '@/app/actions/transactions'
import { TransactionAnalysis } from '@/lib/gemini/ai'

interface TransactionInputProps {
    onTransactionCreated?: () => void
}

interface EditablePreview extends TransactionAnalysis {
    date: string
}

const categoryConfig = {
    sales: { label: 'Sales', color: 'bg-green-100 text-green-700 border-green-200', icon: '📈' },
    purchase: { label: 'Purchase', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🛒' },
    expense: { label: 'Expense', color: 'bg-red-100 text-red-700 border-red-200', icon: '💸' },
    income: { label: 'Income', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '💰' }
}

export default function TransactionInput({ onTransactionCreated }: TransactionInputProps) {
    const [prompt, setPrompt] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [preview, setPreview] = useState<EditablePreview | null>(null)

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0]
    }

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!prompt.trim()) {
            setError('Please enter a transaction description')
            return
        }

        setIsAnalyzing(true)
        setError(null)
        setSuccess(null)
        setPreview(null)

        try {
            const result = await analyzeTransactionPrompt(prompt)

            if (result.success && result.analysis) {
                setPreview({
                    ...result.analysis,
                    date: getTodayDate()
                })
            } else {
                setError(result.error || 'Failed to analyze transaction')
            }
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleConfirm = async () => {
        if (!preview) return

        setIsSaving(true)
        setError(null)

        try {
            const analysisToSave: TransactionAnalysis = {
                category: preview.category,
                description: preview.description,
                amount: preview.amount,
                party_name: preview.party_name
            }

            const result = await saveTransaction(prompt, analysisToSave, preview.date)

            if (result.success && result.transaction) {
                setSuccess(`Transaction recorded: ${result.transaction.description} (₹${result.transaction.amount.toLocaleString('en-IN')})`)
                setPrompt('')
                setPreview(null)
                onTransactionCreated?.()
            } else {
                setError(result.error || 'Failed to save transaction')
            }
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setPreview(null)
        setError(null)
    }

    const updatePreview = (field: keyof EditablePreview, value: string | number) => {
        if (!preview) return
        setPreview({ ...preview, [field]: value })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatDateDisplay = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const examplePrompts = [
        "Sold 10 laptops to ABC Corp for ₹5,00,000",
        "Purchased office supplies for ₹2,500",
        "Received consulting fee of ₹50,000 from XYZ Ltd",
        "Paid electricity bill ₹8,000"
    ]

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">AI Transaction Entry</h3>
                    <p className="text-sm text-foreground/50">Describe your transaction in natural language</p>
                </div>
            </div>

            {/* Preview Modal with Editable Fields */}
            {preview && (
                <div className="mb-6 p-5 rounded-xl bg-secondary/30 border-2 border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit & Confirm
                        </h4>
                        <div className="flex items-center gap-2">
                            {(['sales', 'purchase', 'expense', 'income'] as const).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => updatePreview('category', cat)}
                                    className={`text-xs px-2 py-1 rounded-full font-medium border transition-all ${preview.category === cat
                                        ? categoryConfig[cat].color
                                        : 'bg-input text-foreground/50 border-border hover:bg-secondary'
                                        }`}
                                >
                                    {categoryConfig[cat].icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Description - Editable */}
                        <div>
                            <label className="text-foreground/50 text-sm mb-1 block">Description</label>
                            <input
                                type="text"
                                value={preview.description}
                                onChange={(e) => updatePreview('description', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Amount - Editable */}
                        <div>
                            <label className="text-foreground/50 text-sm mb-1 block">Amount (₹)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">₹</span>
                                <input
                                    type="number"
                                    value={preview.amount}
                                    onChange={(e) => updatePreview('amount', parseFloat(e.target.value) || 0)}
                                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-card border border-border text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Party Name - Editable */}
                        <div>
                            <label className="text-foreground/50 text-sm mb-1 block">Party Name (optional)</label>
                            <input
                                type="text"
                                value={preview.party_name || ''}
                                onChange={(e) => updatePreview('party_name', e.target.value)}
                                placeholder="Customer or vendor name"
                                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Date - Editable */}
                        <div>
                            <label className="text-foreground/50 text-sm mb-1 block">Date</label>
                            <input
                                type="date"
                                value={preview.date}
                                onChange={(e) => updatePreview('date', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-foreground/40 mt-1">{formatDateDisplay(preview.date)}</p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mt-4 p-3 rounded-lg bg-card border border-border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm px-2 py-0.5 rounded-full font-medium border ${categoryConfig[preview.category].color}`}>
                                    {categoryConfig[preview.category].icon} {categoryConfig[preview.category].label}
                                </span>
                            </div>
                            <span className={`text-xl font-bold ${preview.category === 'sales' || preview.category === 'income'
                                ? 'text-green-600'
                                : 'text-red-600'
                                }`}>
                                {preview.category === 'sales' || preview.category === 'income' ? '+' : '-'}
                                {formatCurrency(preview.amount)}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-5 pt-4 border-t border-border">
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="flex-1 py-2.5 px-4 rounded-lg border-2 border-border text-foreground/70 font-medium hover:bg-secondary transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isSaving || !preview.description || preview.amount <= 0}
                            className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                                    Confirm & Save
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Input Form */}
            {!preview && (
                <form onSubmit={handleAnalyze}>
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Sold 10 laptops to ABC Corp for ₹5 lakh"
                            className="w-full px-4 py-3 pr-24 rounded-xl bg-input/50 border border-border text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                            rows={3}
                            disabled={isAnalyzing}
                        />
                        <button
                            type="submit"
                            disabled={isAnalyzing || !prompt.trim()}
                            className="absolute right-3 bottom-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {isAnalyzing ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    Analyze
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* Status Messages */}
            {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50/10 border border-red-500/20">
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            )}

            {success && (
                <div className="mt-4 p-3 rounded-lg bg-green-50/10 border border-green-500/20">
                    <p className="text-green-500 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {success}
                    </p>
                </div>
            )}

            {/* Example Prompts */}
            {!preview && (
                <div className="mt-4">
                    <p className="text-xs text-foreground/50 mb-2">Try these examples:</p>
                    <div className="flex flex-wrap gap-2">
                        {examplePrompts.map((example, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setPrompt(example)}
                                className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground/70 hover:bg-primary/10 hover:text-primary transition-all"
                            >
                                {example.length > 30 ? example.slice(0, 30) + '...' : example}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
