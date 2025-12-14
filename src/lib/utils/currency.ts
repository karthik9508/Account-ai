import { CURRENCIES, DATE_FORMATS } from '@/lib/constants/currencies'

export function formatCurrency(amount: number, currencyCode: string = 'INR'): string {
    const currency = CURRENCIES.find(c => c.code === currencyCode)

    // Map currency codes to locale
    const localeMap: Record<string, string> = {
        'INR': 'en-IN',
        'USD': 'en-US',
        'EUR': 'de-DE',
        'GBP': 'en-GB',
        'JPY': 'ja-JP',
        'AUD': 'en-AU',
        'CAD': 'en-CA',
        'CHF': 'de-CH',
        'CNY': 'zh-CN',
        'AED': 'ar-AE',
        'SGD': 'en-SG',
    }

    const locale = localeMap[currencyCode] || 'en-US'

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            maximumFractionDigits: 0
        }).format(amount)
    } catch {
        // Fallback if currency code is not supported
        return `${currency?.symbol || '₹'}${amount.toLocaleString()}`
    }
}

export function getCurrencySymbol(currencyCode: string = 'INR'): string {
    const currency = CURRENCIES.find(c => c.code === currencyCode)
    return currency?.symbol || '₹'
}

export function formatDate(dateString: string, formatCode: string = 'DD/MM/YYYY'): string {
    const date = new Date(dateString)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    // Also include time
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const time = `${hours}:${minutes}`

    switch (formatCode) {
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}, ${time}`
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}, ${time}`
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}, ${time}`
        default:
            return `${day}/${month}/${year}, ${time}`
    }
}

export function formatDateShort(dateString: string, formatCode: string = 'DD/MM/YYYY'): string {
    const date = new Date(dateString)

    const day = date.getDate()
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    switch (formatCode) {
        case 'DD/MM/YYYY':
            return `${day} ${month} ${year}`
        case 'MM/DD/YYYY':
            return `${month} ${day}, ${year}`
        case 'YYYY-MM-DD':
            return `${year} ${month} ${day}`
        default:
            return `${day} ${month} ${year}`
    }
}
