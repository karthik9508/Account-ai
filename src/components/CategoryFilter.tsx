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
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : 'bg-card text-foreground/70 border border-border hover:border-primary/50 hover:text-primary hover:bg-secondary/50'
                        }`}
                >
                    <span>{category.icon}</span>
                    {category.label}
                </button>
            ))}
        </div>
    )
}
