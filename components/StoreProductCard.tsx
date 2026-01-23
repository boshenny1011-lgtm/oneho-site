import Image from 'next/image';
import Link from 'next/link';
import type { WooCommerceStoreProduct } from '@/lib/woocommerce.types';
import { ArrowRight } from 'lucide-react';
import { getBestProductImage } from '@/lib/image-matcher';

interface StoreProductCardProps {
  product: WooCommerceStoreProduct;
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

export default function StoreProductCard({ product }: StoreProductCardProps) {
  const imageUrl = getBestProductImage(product);
  const price = formatStorePrice(product);

  return (
    <div className="group">
      <Link href={`/product/${product.id}`} className="block border border-gray-200 bg-white hover:border-gray-900 transition-all duration-300">
        <div className="aspect-square relative overflow-hidden bg-gray-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No image available
            </div>
          )}
        </div>

        <div className="p-6">
          {product.sku && (
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              SKU: {product.sku}
            </p>
          )}

          <h3 className="font-medium text-lg text-gray-900 mb-3 leading-tight group-hover:text-gray-600 transition-colors duration-200">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2.5 mb-4">
            {product.on_sale && product.prices?.regular_price && product.prices.regular_price !== product.prices.price && (
              <span className="text-sm line-through text-gray-400">
                {product.prices.currency_prefix}
                {(parseInt(product.prices.regular_price) / Math.pow(10, product.prices.currency_minor_unit)).toFixed(product.prices.currency_minor_unit)}
                {product.prices.currency_suffix}
              </span>
            )}
            <span className={`text-lg font-semibold ${product.on_sale ? 'text-red-600' : 'text-gray-900'}`}>
              {price}
            </span>
          </div>

          <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors duration-200">
            <span>View Details</span>
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  );
}
