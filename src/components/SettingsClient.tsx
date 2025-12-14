'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-700 font-medium">Operation completed successfully!</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {/* Account Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-black">Account</h2>
                    <p className="text-sm text-gray-500">Your account information</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <p className="text-sm font-medium text-black">Email Address</p>
                            <p className="text-sm text-gray-500">{userEmail}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            Verified
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <p className="text-sm font-medium text-black">Account ID</p>
                            <p className="text-sm text-gray-500 font-mono">{userId.substring(0, 8)}...</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-medium text-black">Member Since</p>
                            <p className="text-sm text-gray-500">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-black">Preferences</h2>
                        <p className="text-sm text-gray-500">Customize your experience</p>
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
                    <div className="pb-6 border-b border-gray-100">
                        <div className="mb-3">
                            <p className="text-sm font-medium text-black">Currency</p>
                            <p className="text-sm text-gray-500">Display currency for transactions</p>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {CURRENCIES.map((curr) => (
                                <button
                                    key={curr.code}
                                    onClick={() => handleCurrencyChange(curr.code)}
                                    disabled={isSaving}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${currency === curr.code
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        } ${isSaving ? 'opacity-50' : ''}`}
                                >
                                    <div className="text-lg font-bold text-black">{curr.symbol}</div>
                                    <div className="text-xs text-gray-500">{curr.code}</div>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-black">Data & Privacy</h2>
                    <p className="text-sm text-gray-500">Manage your data</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <p className="text-sm font-medium text-black">Export Data</p>
                            <p className="text-sm text-gray-500">Download all your transactions as CSV</p>
                        </div>
                        <button
                            onClick={handleExportCSV}
                            disabled={isExporting}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
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
                            <p className="text-sm font-medium text-black">Delete Account</p>
                            <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 rounded-lg border-2 border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-all"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-black">About</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-black">Account AI</p>
                            <p className="text-sm text-gray-500">Version 1.0.0</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
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
