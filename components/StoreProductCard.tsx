'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { WooCommerceStoreProduct } from '@/lib/woocommerce.types';
import { ShoppingCart, FileText } from 'lucide-react';
import { getBestProductImage } from '@/lib/image-matcher';
import { useCart } from '@/contexts/CartContext';

interface StoreProductCardProps {
  product: WooCommerceStoreProduct;
  layout?: 'grid' | 'list';
}

function formatStorePrice(product: WooCommerceStoreProduct): string {
  try {
    if (product.prices?.price) {
      const priceValue = parseInt(product.prices.price) / Math.pow(10, product.prices.currency_minor_unit);
      const prefix = product.prices.currency_prefix || '';
      const suffix = product.prices.currency_suffix || '';
      return `${prefix}${priceValue.toFixed(product.prices.currency_minor_unit)}${suffix}`;
    }

    if (product.price_html) {
      return product.price_html.replace(/<[^>]*>/g, '');
    }
  } catch (error) {
    console.error('Error formatting price:', error);
  }

  return 'Contact us';
}

export default function StoreProductCard({ product, layout = 'grid' }: StoreProductCardProps) {
  const imageUrl = getBestProductImage(product);
  const price = formatStorePrice(product);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, 1);
  };

  if (layout === 'list') {
    return (
      <div className="group bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
        <div className="flex gap-6 p-6">
          <Link href={`/product/${product.id}`} className="w-48 h-48 flex-shrink-0 bg-gray-50 relative overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            )}
          </Link>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link href={`/product/${product.id}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-baseline gap-3 mb-4">
                {product.on_sale && product.prices?.regular_price && product.prices.regular_price !== product.prices.price && (
                  <span className="text-base line-through text-gray-400">
                    {product.prices.currency_prefix}
                    {(parseInt(product.prices.regular_price) / Math.pow(10, product.prices.currency_minor_unit)).toFixed(product.prices.currency_minor_unit)}
                    {product.prices.currency_suffix}
                  </span>
                )}
                <span className={`text-2xl font-bold ${product.on_sale ? 'text-red-600' : 'text-gray-900'}`}>
                  {price}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-medium"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to cart
              </button>
              <Link
                href={`/product/${product.id}`}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 hover:border-gray-900 transition-colors font-medium"
              >
                <FileText className="w-4 h-4" />
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-gray-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No image available
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-base text-gray-900 mb-3 leading-tight hover:text-gray-600 transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mb-4">
          {product.on_sale && product.prices?.regular_price && product.prices.regular_price !== product.prices.price && (
            <span className="text-sm line-through text-gray-400">
              {product.prices.currency_prefix}
              {(parseInt(product.prices.regular_price) / Math.pow(10, product.prices.currency_minor_unit)).toFixed(product.prices.currency_minor_unit)}
              {product.prices.currency_suffix}
            </span>
          )}
          <span className={`text-lg font-bold ${product.on_sale ? 'text-red-600' : 'text-gray-900'}`}>
            {price}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-black text-white hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add to cart</span>
          </button>
          <Link
            href={`/product/${product.id}`}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-gray-300 hover:border-gray-900 transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
