export interface WooCommerceStoreProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  sku: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    price_range: {
      min_amount: string;
      max_amount: string;
    } | null;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
  };
  price_html: string;
  on_sale: boolean;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  stock_status: string;
  stock_quantity: number | null;
}

export interface WooCommerceStoreCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: {
    id: number;
    src: string;
    name: string;
    alt: string;
  } | null;
  count: number;
}

export interface WooCommerceApiError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}
