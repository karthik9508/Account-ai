import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getReportData } from '@/app/actions/reports'
import ReportsClient from '@/components/ReportsClient'

export default async function ReportsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: reportData } = await getReportData()

    return (
        <>
            {/* Top Header */}
            <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Financial Reports</h1>
                    <p className="text-sm text-muted-foreground">View your financial statements and analytics</p>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="p-8">
                <ReportsClient initialData={reportData || null} />
            </main>
        </>
    )
}
