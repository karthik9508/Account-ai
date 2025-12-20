'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { UserSettings, updateUserSettings } from '@/app/actions/settings'
import { exportTransactionsCSV, deleteUserAccount } from '@/app/actions/account'
import { CURRENCIES, DATE_FORMATS, FISCAL_YEARS } from '@/lib/constants/currencies'
import ConfirmModal from './ConfirmModal'

interface SettingsClientProps {
    settings: UserSettings | null
    userEmail: string
    userId: string
    createdAt: string
}

export default function SettingsClient({ settings, userEmail, userId, createdAt }: SettingsClientProps) {
    const router = useRouter()
    const [currency, setCurrency] = useState(settings?.currency || 'INR')
    const [dateFormat, setDateFormat] = useState(settings?.date_format || 'DD/MM/YYYY')
    const [fiscalYear, setFiscalYear] = useState(settings?.fiscal_year_start || 'April')
    const [isSaving, setIsSaving] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const saveSettings = async (newCurrency: string, newDateFormat: string, newFiscalYear: string) => {
        setIsSaving(true)
        setError(null)
        setSuccess(false)

        try {
            const result = await updateUserSettings(newCurrency, newDateFormat, newFiscalYear)
            if (result.success) {
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            } else {
                setError(result.error || 'Failed to save')
            }
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCurrencyChange = (newCurrency: string) => {
        setCurrency(newCurrency)
        saveSettings(newCurrency, dateFormat, fiscalYear)
    }

    const handleDateFormatChange = (newFormat: string) => {
        setDateFormat(newFormat)
        saveSettings(currency, newFormat, fiscalYear)
    }

    const handleFiscalYearChange = (newYear: string) => {
        setFiscalYear(newYear)
        saveSettings(currency, dateFormat, newYear)
    }

    const handleExportCSV = async () => {
        setIsExporting(true)
        setError(null)

        try {
            const result = await exportTransactionsCSV()
            if (result.success && result.csv) {
                // Create blob and download
                const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)

                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            } else {
                setError(result.error || 'Failed to export')
            }
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setIsExporting(false)
        }
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        setError(null)

        try {
            const result = await deleteUserAccount()
            if (result.success) {
                router.push('/login')
            } else {
                setError(result.error || 'Failed to delete account')
                setShowDeleteConfirm(false)
            }
        } catch {
            setError('An unexpected error occurred')
            setShowDeleteConfirm(false)
        } finally {
            setIsDeleting(false)
        }
    }

    const currentCurrencyInfo = CURRENCIES.find(c => c.code === currency)

    return (


        <div className="space-y-6">
            {/* Success Message */}
            {
                success && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-green-700 font-medium">Operation completed successfully!</p>
                    </div>
                )
            }

            {/* Error Message */}
            {
                error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )
            }

            {/* Account Section */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Account</h2>
                    <p className="text-sm text-muted-foreground">Your account information</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div>
                            <p className="text-sm font-medium text-foreground">Email Address</p>
                            <p className="text-sm text-muted-foreground">{userEmail}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                            Verified
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div>
                            <p className="text-sm font-medium text-foreground">Account ID</p>
                            <p className="text-sm text-muted-foreground font-mono">{userId.substring(0, 8)}...</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-medium text-foreground">Member Since</p>
                            <p className="text-sm text-muted-foreground">
                                {new Date(createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
                        <p className="text-sm text-muted-foreground">Customize your experience</p>
                    </div>
                    {isSaving && (
                        <div className="flex items-center gap-2 text-blue-600 text-sm">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </div>
                    )}
                </div>
                <div className="p-6 space-y-6">
                    {/* Currency Selector */}
                    <div className="pb-6 border-b border-border">
                        <div className="mb-3">
                            <p className="text-sm font-medium text-foreground">Currency</p>
                            <p className="text-sm text-muted-foreground">Display currency for transactions</p>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {CURRENCIES.map((curr) => (
                                <button
                                    key={curr.code}
                                    onClick={() => handleCurrencyChange(curr.code)}
                                    disabled={isSaving}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${currency === curr.code
                                        ? 'border-primary bg-secondary'
                                        : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                                        } ${isSaving ? 'opacity-50' : ''}`}
                                >
                                    <div className="text-lg font-bold text-foreground">{curr.symbol}</div>
                                    <div className="text-xs text-muted-foreground">{curr.code}</div>
                                </button>
                            ))}
                        </div>
                        {currentCurrencyInfo && (
                            <p className="mt-3 text-sm text-gray-600">
                                Selected: <span className="font-medium">{currentCurrencyInfo.name}</span> ({currentCurrencyInfo.symbol})
                            </p>
                        )}
                    </div>

                    {/* Date Format Selector */}
                    <div className="pb-6 border-b border-gray-100">
                        <div className="mb-3">
                            <p className="text-sm font-medium text-black">Date Format</p>
                            <p className="text-sm text-gray-500">How dates are displayed in transactions</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {DATE_FORMATS.map((format) => (
                                <button
                                    key={format.code}
                                    onClick={() => handleDateFormatChange(format.code)}
                                    disabled={isSaving}
                                    className={`p-4 rounded-lg border-2 transition-all text-center ${dateFormat === format.code
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        } ${isSaving ? 'opacity-50' : ''}`}
                                >
                                    <div className="text-sm font-bold text-black">{format.label}</div>
                                    <div className="text-xs text-gray-500 mt-1">{format.example}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fiscal Year Selector */}
                    <div>
                        <div className="mb-3">
                            <p className="text-sm font-medium text-black">Financial Year</p>
                            <p className="text-sm text-gray-500">Start of your fiscal year for reports</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {FISCAL_YEARS.map((fy) => (
                                <button
                                    key={fy.code}
                                    onClick={() => handleFiscalYearChange(fy.code)}
                                    disabled={isSaving}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${fiscalYear === fy.code
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        } ${isSaving ? 'opacity-50' : ''}`}
                                >
                                    <div className="text-sm font-bold text-black">{fy.label}</div>
                                    <div className="text-xs text-gray-500 mt-1">{fy.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Section */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Data & Privacy</h2>
                    <p className="text-sm text-muted-foreground">Manage your data</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div>
                            <p className="text-sm font-medium text-foreground">Export Data</p>
                            <p className="text-sm text-muted-foreground">Download all your transactions as CSV</p>
                        </div>
                        <button
                            onClick={handleExportCSV}
                            disabled={isExporting}
                            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isExporting ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Export CSV
                                </>
                            )}
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-medium text-foreground">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 rounded-lg border-2 border-red-500/20 text-red-600 text-sm font-medium hover:bg-red-500/10 transition-all"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Appearance Section */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
                    <p className="text-sm text-muted-foreground">Customize how Account AI looks on your device</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-4 rounded-lg border-2 transition-all text-center ${theme === 'light'
                                ? 'border-primary bg-secondary'
                                : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                                }`}
                        >
                            <div className="flex justify-center mb-2">
                                <svg className={`w-6 h-6 ${theme === 'light' ? 'text-primary-foreground' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="text-sm font-bold text-foreground">Light</div>
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-4 rounded-lg border-2 transition-all text-center ${theme === 'dark'
                                ? 'border-primary bg-secondary'
                                : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                                }`}
                        >
                            <div className="flex justify-center mb-2">
                                <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-primary-foreground' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            </div>
                            <div className="text-sm font-bold text-foreground">Dark</div>
                        </button>
                        <button
                            onClick={() => setTheme('system')}
                            className={`p-4 rounded-lg border-2 transition-all text-center ${theme === 'system'
                                ? 'border-primary bg-secondary'
                                : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                                }`}
                        >
                            <div className="flex justify-center mb-2">
                                <svg className={`w-6 h-6 ${theme === 'system' ? 'text-primary-foreground' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-sm font-bold text-foreground">System</div>
                        </button>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">About</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">A</span>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-foreground">Account AI</p>
                            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        AI-powered accounting made simple. Record transactions using natural language
                        and let AI categorize them for you.
                    </p>
                </div>
            </div>

            {/* Delete Account Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Account"
                message="Are you sure you want to delete your account? This will permanently delete all your transactions and data. This action cannot be undone."
                confirmText="Delete Forever"
                cancelText="Cancel"
                onConfirm={handleDeleteAccount}
                onCancel={() => setShowDeleteConfirm(false)}
                isLoading={isDeleting}
            />
        </div>
    )
}
