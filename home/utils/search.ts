import type { Product } from '~/types'
import type { SearchResult } from '~/stores/search'

// Debounce function for search input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Calculate string similarity using Levenshtein distance
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase()
  const s2 = str2.toLowerCase()
  
  if (s1 === s2) return 1
  if (s1.includes(s2) || s2.includes(s1)) return 0.8
  
  const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null))
  
  for (let i = 0; i <= s1.length; i++) {
    if (matrix[0]) matrix[0][i] = i
  }
  for (let j = 0; j <= s2.length; j++) {
    if (matrix[j]) matrix[j][0] = j
  }
  
  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1
      if (matrix[j] && matrix[j - 1]) {
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }
  }
  
  const maxLength = Math.max(s1.length, s2.length)
  const finalMatrix = matrix[s2.length]
  return finalMatrix ? (maxLength - finalMatrix[s1.length]) / maxLength : 0
}

// Calculate relevance score for a product
function calculateRelevanceScore(product: Product, query: string): number {
  const searchTerm = query.toLowerCase().trim()
  let score = 0
  
  // Exact name match gets highest score
  if (product.name.toLowerCase() === searchTerm) {
    score += 100
  }
  
  // Name contains search term
  else if (product.name.toLowerCase().includes(searchTerm)) {
    score += 80
  }
  
  // Name similarity using Levenshtein distance
  else {
    const nameSimilarity = calculateSimilarity(product.name, searchTerm)
    if (nameSimilarity > 0.6) {
      score += nameSimilarity * 60
    }
  }
  
  // Category match
  if (product.category.toLowerCase().includes(searchTerm)) {
    score += 40
  }
  
  // Subcategory match
  if (product.subcategory?.toLowerCase().includes(searchTerm)) {
    score += 30
  }
  
  // Description match
  if (product.description?.toLowerCase().includes(searchTerm)) {
    score += 20
  }
  
  // Boost for in-stock items
  if (product.inStock) {
    score += 10
  }
  
  // Boost for featured items
  if (product.featured) {
    score += 15
  }
  
  // Boost for items on sale
  if (product.originalPrice && product.originalPrice > product.price) {
    score += 5
  }
  
  // Search individual words
  const words = searchTerm.split(' ').filter(word => word.length > 2)
  words.forEach(word => {
    if (product.name.toLowerCase().includes(word)) {
      score += 25
    }
    if (product.description?.toLowerCase().includes(word)) {
      score += 10
    }
  })
  
  return score
}

// Main search function
export function searchInProducts(query: string, products: Product[]): SearchResult[] {
  if (!query.trim()) return []
  
  const results: SearchResult[] = []
  
  products.forEach(product => {
    const relevanceScore = calculateRelevanceScore(product, query)
    
    // Only include results with a minimum relevance score
    if (relevanceScore > 10) {
      results.push({
        ...product,
        relevanceScore
      })
    }
  })
  
  // Sort by relevance score (highest first)
  return results
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 50) // Limit to 50 results for performance
}

// Get search suggestions based on input
export function getSearchSuggestions(query: string, products: Product[]): string[] {
  if (!query.trim() || query.length < 2) return []
  
  const suggestions = new Set<string>()
  const searchTerm = query.toLowerCase()
  
  // Add product names that start with or contain the search term
  products.forEach(product => {
    const name = product.name.toLowerCase()
    if (name.includes(searchTerm)) {
      suggestions.add(product.name)
    }
    
    // Add individual words from product names
    const words = product.name.split(' ')
    words.forEach(word => {
      if (word.toLowerCase().includes(searchTerm) && word.length > 2) {
        suggestions.add(word)
      }
    })
  })
  
  return Array.from(suggestions).slice(0, 10)
}

// Highlight matching text in search results
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text
  
  const searchTerm = query.toLowerCase()
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>')
}

// Format price for display
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(price)
}

// Check if search query is valid
export function isValidSearchQuery(query: string): boolean {
  return query.trim().length >= 2 && query.trim().length <= 100
}