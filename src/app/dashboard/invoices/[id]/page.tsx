import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getInvoiceById } from '@/app/actions/invoices'
import { getUserSettings } from '@/app/actions/settings'
import InvoicePreview from '@/components/InvoicePreview'
import Link from 'next/link'

interface InvoiceDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const result = await getInvoiceById(id)
    if (!result.success || !result.invoice) {
        notFound()
    }

    const { settings } = await getUserSettings()
    const currency = settings?.currency || 'INR'

    return (
        <>
            {/* Header */}
            <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-10 print:hidden">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/invoices"
                        className="p-2 rounded-lg hover:bg-secondary text-foreground/50 hover:text-foreground transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">{result.invoice.invoice_number}</h1>
                        <p className="text-sm text-foreground/50">Invoice for {result.invoice.customer_name}</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="p-8 print:p-0">
                <InvoicePreview invoice={result.invoice} currency={currency} />
            </main>
        </>
    )
}
