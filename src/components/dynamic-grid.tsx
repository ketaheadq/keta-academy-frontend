"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calculator,
  Search,
  Filter,
} from "lucide-react"

// Generic interfaces for dynamic filtering
interface FilterableItem {
  id: string | number
  [key: string]: any
}

interface FilterConfig {
  field: string
  label: string
  type: 'select' | 'search' | 'multi-select'
  options?: string[]
  allLabel?: string // e.g., "All Grades", "All Topics"
}

interface DynamicGridProps<T extends FilterableItem> {
  items: T[]
  filterConfigs: FilterConfig[]
  searchFields: string[] // fields to search in
  renderItem: (item: T, index: number) => React.ReactNode
  title?: React.ReactNode
  emptyStateConfig?: {
    icon?: React.ReactNode
    title: string
    description: string
  }
  className?: string
}

export default function DynamicGrid<T extends FilterableItem>({ 
  items, 
  filterConfigs,
  searchFields,
  renderItem,
  title = <h1 className="text-2xl font-semibold text-gray-900">📚 Items</h1>,
  emptyStateConfig = {
    icon: <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />,
    title: "No items found",
    description: "Try adjusting your filters to find what you're looking for."
  },
  className = ""
}: DynamicGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(() => {
    const initialFilters: Record<string, string> = {}
    filterConfigs.forEach(config => {
      if (config.type === 'select') {
        initialFilters[config.field] = config.allLabel || `All ${config.label}`
      }
    })
    return initialFilters
  })
  const [showFilters, setShowFilters] = useState(false)

  // Helper function to normalize Turkish characters for search
  const normalizeTurkish = (str: string): string => {
    if (!str) return ''
    return str
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/İ/g, 'i')
      .replace(/Ğ/g, 'g')
      .replace(/Ü/g, 'u')
      .replace(/Ş/g, 's')
      .replace(/I/g, 'i')
      .replace(/Ö/g, 'o')
      .replace(/Ç/g, 'c')
      .toLowerCase()
  }

  // Helper function to get nested property value
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object') {
        return current[key]
      }
      return current
    }, obj)
  }

  // Helper function to check if item matches filter
  const matchesFilter = (item: T, config: FilterConfig): boolean => {
    const selectedValue = selectedFilters[config.field]
    const allLabel = config.allLabel || `All ${config.label}`
    
    if (selectedValue === allLabel) return true
    
    const itemValue = getNestedValue(item, config.field)
    
    // Handle array fields (like grades)
    if (Array.isArray(itemValue)) {
      return itemValue.some(val => {
        // If array contains objects with title property
        if (typeof val === 'object' && val?.title) {
          return val.title === selectedValue
        }
        // If array contains primitive values
        return String(val) === selectedValue
      })
    }
    
    // Handle object fields (like subject.title)
    if (typeof itemValue === 'object' && itemValue?.title) {
      return itemValue.title === selectedValue
    }
    
    // Handle primitive values
    return String(itemValue) === selectedValue
  }

  const filteredItems = items.filter((item) => {
    // Search filter
    const matchesSearch = searchFields.length === 0 || searchFields.some(field => {
      const value = getNestedValue(item, field)
      return normalizeTurkish(String(value)).includes(normalizeTurkish(searchTerm))
    })

    // Other filters
    const matchesFilters = filterConfigs.every(config => matchesFilter(item, config))

    return matchesSearch && matchesFilters
  })

  const handleFilterChange = (field: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className={className}>
      {/* Search and Filter Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          {title}
        </h2>
          <div className="flex items-center space-x-4">
            {searchFields.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            )}
            {filterConfigs.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        {showFilters && filterConfigs.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg border grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterConfigs.map((config) => (
              <div key={config.field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {config.label}
                </label>
                <Select 
                  value={selectedFilters[config.field]} 
                  onValueChange={(value) => handleFilterChange(config.field, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      key={`all-${config.field}`} 
                      value={config.allLabel || `All ${config.label}`}
                    >
                      {config.allLabel || `All ${config.label}`}
                    </SelectItem>
                    {config.options?.filter(Boolean).map((option, index) => (
                      <SelectItem key={`${config.field}-${index}-${option}`} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Items Grid */}
      <section className="mb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => renderItem(item, index))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            {emptyStateConfig.icon}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {emptyStateConfig.title}
            </h3>
            <p className="text-gray-600">{emptyStateConfig.description}</p>
          </div>
        )}
      </section>
    </div>
  )
} 