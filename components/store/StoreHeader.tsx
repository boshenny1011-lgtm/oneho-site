'use client';

import { Search, Grid3x3, List, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

interface StoreHeaderProps {
  categoryName: string;
  productCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'date' | 'price-asc' | 'price-desc' | 'name';
  onSortChange: (sort: 'date' | 'price-asc' | 'price-desc' | 'name') => void;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function StoreHeader({
  categoryName,
  productCount,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  perPage,
  onPerPageChange,
  viewMode,
  onViewModeChange,
}: StoreHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-100 py-4 px-6 -mx-6 lg:-mx-8">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">»</span>
          <span className="text-gray-900 font-medium">Shop</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative flex-1 w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors text-sm"
          />
          <button className="absolute right-0 top-0 bottom-0 px-4 bg-black text-white hover:bg-gray-800 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 text-sm font-medium hover:border-gray-900 focus:outline-none focus:border-gray-900 transition-colors cursor-pointer bg-white"
            >
              <option value="date">Sort by Date</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
          </div>

          <button className="p-2.5 border border-gray-300 hover:border-gray-900 transition-colors">
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative">
            <select
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 text-sm font-medium hover:border-gray-900 focus:outline-none focus:border-gray-900 transition-colors cursor-pointer bg-white"
            >
              <option value="8">Show 8 Products</option>
              <option value="16">Show 16 Products</option>
              <option value="24">Show 24 Products</option>
              <option value="48">Show 48 Products</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2.5 border transition-colors ${
                viewMode === 'grid'
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 hover:border-gray-900'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2.5 border transition-colors ${
                viewMode === 'list'
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 hover:border-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
