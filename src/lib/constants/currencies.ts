export const CURRENCIES = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
]

export const DATE_FORMATS = [
    { code: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '14/12/2024' },
    { code: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '12/14/2024' },
    { code: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2024-12-14' },
]

export const FISCAL_YEARS = [
    { code: 'April', label: 'April - March', description: 'Indian Financial Year' },
    { code: 'January', label: 'January - December', description: 'Calendar Year' },
]

export type CurrencyCode = typeof CURRENCIES[number]['code']
export type DateFormatCode = typeof DATE_FORMATS[number]['code']
export type FiscalYearCode = typeof FISCAL_YEARS[number]['code']
