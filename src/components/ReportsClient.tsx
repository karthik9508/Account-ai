'use client'

import { useState } from 'react'
import { ReportData, getReportData } from '@/app/actions/reports'

interface ReportsClientProps {
    initialData: ReportData | null
}

export default function ReportsClient({ initialData }: ReportsClientProps) {
    const [data, setData] = useState<ReportData | null>(initialData)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'pnl' | 'cashflow' | 'summary'>('pnl')
    const [startDate, setStartDate] = useState(initialData?.startDate || '')
    const [endDate, setEndDate] = useState(initialData?.endDate || '')

    const refreshData = async () => {
        setIsLoading(true)
        try {
            const result = await getReportData(startDate, endDate)
            if (result.success && result.data) {
                setData(result.data)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    if (!data) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">No Data Available</h3>
                <p className="text-gray-500 text-sm">Add some transactions to see your reports</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Date Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">From:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">To:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={refreshData}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Apply
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Report Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('pnl')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'pnl'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    📊 Profit & Loss
                </button>
                <button
                    onClick={() => setActiveTab('cashflow')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'cashflow'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    💰 Cash Flow
                </button>
                <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'summary'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    📈 Summary
                </button>
            </div>

            {/* Profit & Loss Statement */}
            {activeTab === 'pnl' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                        <h2 className="text-lg font-semibold text-black">Profit & Loss Statement</h2>
                        <p className="text-sm text-gray-500">
                            {formatDate(data.startDate)} - {formatDate(data.endDate)}
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Revenue Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Revenue</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-black">Sales Revenue</span>
                                    <span className="text-green-600 font-medium">{formatCurrency(data.totalSales)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-black">Other Income</span>
                                    <span className="text-green-600 font-medium">{formatCurrency(data.totalIncome)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 bg-green-50 rounded-lg px-3 -mx-3">
                                    <span className="text-black font-semibold">Total Revenue</span>
                                    <span className="text-green-700 font-bold text-lg">{formatCurrency(data.totalRevenue)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Costs Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Costs & Expenses</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-black">Cost of Goods (Purchases)</span>
                                    <span className="text-red-600 font-medium">({formatCurrency(data.totalPurchases)})</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-black">Operating Expenses</span>
                                    <span className="text-red-600 font-medium">({formatCurrency(data.totalExpenses)})</span>
                                </div>
                                <div className="flex justify-between items-center py-2 bg-red-50 rounded-lg px-3 -mx-3">
                                    <span className="text-black font-semibold">Total Costs</span>
                                    <span className="text-red-700 font-bold text-lg">({formatCurrency(data.totalCosts)})</span>
                                </div>
                            </div>
                        </div>

                        {/* Profit Section */}
                        <div className="pt-4 border-t-2 border-gray-200">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-black">Gross Profit (Sales - Purchases)</span>
                                    <span className={`font-medium ${data.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(data.grossProfit)}
                                    </span>
                                </div>
                                <div className={`flex justify-between items-center py-4 rounded-xl px-4 -mx-4 ${data.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                    <span className="text-black font-bold text-lg">Net Profit / (Loss)</span>
                                    <span className={`font-bold text-2xl ${data.netProfit >= 0 ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                        {formatCurrency(data.netProfit)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cash Flow Statement */}
            {activeTab === 'cashflow' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
                        <h2 className="text-lg font-semibold text-black">Cash Flow Statement</h2>
                        <p className="text-sm text-gray-500">
                            {formatDate(data.startDate)} - {formatDate(data.endDate)}
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Cash Inflows */}
                        <div>
                            <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                                Cash Inflows
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-black">Cash from Sales</span>
                                    <span className="text-green-600 font-medium">{formatCurrency(data.totalSales)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-black">Cash from Other Income</span>
                                    <span className="text-green-600 font-medium">{formatCurrency(data.totalIncome)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 bg-green-50 rounded-lg px-3 -mx-3">
                                    <span className="text-black font-semibold">Total Inflows</span>
                                    <span className="text-green-700 font-bold">{formatCurrency(data.totalRevenue)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Cash Outflows */}
                        <div>
                            <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                </svg>
                                Cash Outflows
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-black">Purchases</span>
                                    <span className="text-red-600 font-medium">({formatCurrency(data.totalPurchases)})</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-black">Operating Expenses</span>
                                    <span className="text-red-600 font-medium">({formatCurrency(data.totalExpenses)})</span>
                                </div>
                                <div className="flex justify-between items-center py-2 bg-red-50 rounded-lg px-3 -mx-3">
                                    <span className="text-black font-semibold">Total Outflows</span>
                                    <span className="text-red-700 font-bold">({formatCurrency(data.totalCosts)})</span>
                                </div>
                            </div>
                        </div>

                        {/* Net Cash Flow */}
                        <div className={`p-4 rounded-xl ${data.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                            <div className="flex justify-between items-center">
                                <span className="text-black font-bold text-lg">Net Cash Flow</span>
                                <span className={`font-bold text-2xl ${data.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {formatCurrency(data.netProfit)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary View */}
            {activeTab === 'summary' && (
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xl">📈</div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Sales</p>
                                    <p className="text-xl font-bold text-green-600">{formatCurrency(data.totalSales)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">💰</div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Income</p>
                                    <p className="text-xl font-bold text-blue-600">{formatCurrency(data.totalIncome)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-xl">🛒</div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Purchases</p>
                                    <p className="text-xl font-bold text-orange-600">{formatCurrency(data.totalPurchases)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-xl">💸</div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Expenses</p>
                                    <p className="text-xl font-bold text-red-600">{formatCurrency(data.totalExpenses)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Breakdown & Top Transactions */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Category Breakdown */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-black">Category Breakdown</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {data.salesByCategory.map((cat) => (
                                        <div key={cat.category} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium text-black">{cat.category}</span>
                                                    <span className="text-sm text-gray-500">{cat.count} txns</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${cat.category === 'Sales' ? 'bg-green-500' :
                                                                cat.category === 'Income' ? 'bg-blue-500' :
                                                                    cat.category === 'Purchases' ? 'bg-orange-500' :
                                                                        'bg-red-500'
                                                            }`}
                                                        style={{ width: `${Math.min(100, (cat.amount / Math.max(data.totalRevenue, 1)) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-black w-24 text-right">
                                                {formatCurrency(cat.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Transactions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-black">Top Transactions</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {data.topTransactions.length > 0 ? (
                                    data.topTransactions.map((txn) => (
                                        <div key={txn.id} className="px-6 py-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-black truncate max-w-[200px]">{txn.description}</p>
                                                <p className="text-xs text-gray-400">{formatDate(txn.date)}</p>
                                            </div>
                                            <span className={`font-semibold ${txn.category === 'sales' || txn.category === 'income'
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                }`}>
                                                {txn.category === 'sales' || txn.category === 'income' ? '+' : '-'}
                                                {formatCurrency(txn.amount)}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-4 text-gray-500 text-sm text-center">No transactions</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Expense Breakdown */}
                    {data.expensesByCategory.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-black">Top Expenses</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {data.expensesByCategory.slice(0, 5).map((exp, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                            <span className="text-black">{exp.description}</span>
                                            <span className="text-red-600 font-medium">{formatCurrency(exp.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
