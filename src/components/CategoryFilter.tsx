'use client'

interface CategoryFilterProps {
    activeCategory: string
    onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
    const categories = [
        { value: 'all', label: 'All', icon: '📋' },
        { value: 'sales', label: 'Sales', icon: '📈' },
        { value: 'income', label: 'Income', icon: '💰' },
        { value: 'purchase', label: 'Purchase', icon: '🛒' },
        { value: 'expense', label: 'Expense', icon: '💸' }
    ]

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
                <button
                    key={category.value}
                    onClick={() => onCategoryChange(category.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeCategory === category.value
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                        }`}
                >
                    <span>{category.icon}</span>
                    {category.label}
                </button>
            ))}
        </div>
    )
}
