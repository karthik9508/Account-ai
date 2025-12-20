import { formatCurrency as formatCurrencyUtil } from '@/lib/utils/currency'

interface SummaryCardsProps {
    summary: {
        sales: number
        purchase: number
        expense: number
        income: number
    }
    currency?: string
}

export default function SummaryCards({ summary, currency = 'INR' }: SummaryCardsProps) {
    const formatAmount = (amount: number) => formatCurrencyUtil(amount, currency)

    const cards = [
        {
            label: 'Total Sales',
            amount: summary.sales,
            icon: '📈',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            label: 'Total Income',
            amount: summary.income,
            icon: '💰',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: 'Total Purchases',
            amount: summary.purchase,
            icon: '🛒',
            color: 'from-orange-500 to-amber-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
        {
            label: 'Total Expenses',
            amount: summary.expense,
            icon: '💸',
            color: 'from-red-500 to-rose-500',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600'
        }
    ]

    const netProfit = (summary.sales + summary.income) - (summary.purchase + summary.expense)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{card.icon}</span>
                            <div className={`w-8 h-8 rounded-full ${card.bgColor} flex items-center justify-center`}>
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${card.color}`}></div>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                        <p className={`text-xl font-bold ${card.textColor}`}>
                            {formatAmount(card.amount)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Net Profit/Loss Card */}
            <div className={`rounded-xl border p-6 ${netProfit >= 0
                ? 'bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-200/50'
                : 'bg-gradient-to-r from-red-50/50 to-rose-50/50 border-red-200/50'
                }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-foreground/70 mb-1">Net Profit/Loss</p>
                        <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {netProfit >= 0 ? '+' : ''}{formatAmount(netProfit)}
                        </p>
                    </div>
                    <div className={`text-4xl`}>
                        {netProfit >= 0 ? '📊' : '📉'}
                    </div>
                </div>
            </div>
        </div>
    )
}
