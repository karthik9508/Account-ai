'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarNavProps {
    userEmail: string
}

export default function SidebarNav({ userEmail }: SidebarNavProps) {
    const pathname = usePathname()
    const [salesOpen, setSalesOpen] = useState(
        pathname?.startsWith('/dashboard/invoices') ||
        pathname?.startsWith('/dashboard/quotations') ||
        pathname?.startsWith('/dashboard/customers')
    )

    const isActive = (path: string) => pathname === path
    const isInSection = (paths: string[]) => paths.some(p => pathname?.startsWith(p))

    return (
        <nav className="flex-1 px-4 py-6 space-y-1">
            {/* Dashboard */}
            <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/dashboard')
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                    }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
            </Link>

            {/* Transactions */}
            <Link
                href="/dashboard/transactions"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/dashboard/transactions')
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                    }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Transactions
            </Link>

            {/* Sales Section (Collapsible) */}
            <div className="space-y-1">
                <button
                    onClick={() => setSalesOpen(!salesOpen)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isInSection(['/dashboard/invoices', '/dashboard/quotations', '/dashboard/customers'])
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Sales
                    </div>
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 ${salesOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Sales Sub-menu */}
                <div className={`overflow-hidden transition-all duration-200 ${salesOpen ? 'max-h-48' : 'max-h-0'}`}>
                    <div className="pl-4 space-y-1 pt-1">
                        <Link
                            href="/dashboard/invoices"
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname?.startsWith('/dashboard/invoices')
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-foreground/60 hover:bg-secondary hover:text-foreground'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Invoices
                        </Link>

                        <Link
                            href="/dashboard/quotations"
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname?.startsWith('/dashboard/quotations')
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-foreground/60 hover:bg-secondary hover:text-foreground'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Quotations
                            <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-secondary text-foreground/50">Soon</span>
                        </Link>

                        <Link
                            href="/dashboard/customers"
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname?.startsWith('/dashboard/customers')
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-foreground/60 hover:bg-secondary hover:text-foreground'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Customers
                            <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-secondary text-foreground/50">Soon</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Reports */}
            <Link
                href="/dashboard/reports"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/dashboard/reports')
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                    }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Reports
            </Link>

            {/* Settings */}
            <Link
                href="/dashboard/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/dashboard/settings')
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                    }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
            </Link>
        </nav>
    )
}
