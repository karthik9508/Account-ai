import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InvoiceList from '@/components/InvoiceList'
import { getUserSettings } from '@/app/actions/settings'

export default async function InvoicesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { settings } = await getUserSettings()
    const currency = settings?.currency || 'INR'

    return (
        <>
            {/* Header */}
            <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Invoices</h1>
                    <p className="text-sm text-foreground/50">Manage your sales invoices</p>
                </div>
            </header>

            {/* Content */}
            <main className="p-8">
                <InvoiceList currency={currency} />
            </main>
        </>
    )
}
