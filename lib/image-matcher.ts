import type { WooCommerceStoreProduct } from './woocommerce.types';

/**
 * 获取商品图片 URL
 * 优先级：
 * 1. WordPress API 返回的图片
 * 2. 通过商品 ID 匹配本地图片（如 /11.png 对应商品 ID 11）
 * 3. 通过 SKU 匹配本地图片
 * 4. 通过商品名称中的数字匹配本地图片
 * 5. 返回 null（显示占位符）
 */
export function getProductImageUrl(product: WooCommerceStoreProduct): string | null {
  // 1. 优先使用 WordPress API 返回的图片
  if (product.images && product.images.length > 0 && product.images[0].src) {
    const apiImageUrl = product.images[0].src;
    // 检查图片 URL 是否有效（不是占位符或空）
    if (apiImageUrl && !apiImageUrl.includes('placeholder') && apiImageUrl !== '') {
      return apiImageUrl;
    }
  }

  // 2. 通过商品 ID 匹配本地图片
  const idBasedImage = `/${product.id}.png`;
  // 注意：这里我们无法直接检查文件是否存在，但可以尝试
  // 在实际使用中，如果图片不存在，Next.js Image 组件会显示错误
  // 我们可以返回这个路径，让组件尝试加载

  // 3. 通过 SKU 匹配（如果 SKU 是数字）
  if (product.sku) {
    const skuNumber = extractNumber(product.sku);
    if (skuNumber) {
      const skuBasedImage = `/${skuNumber}.png`;
      // 可以尝试这个路径
    }
  }

  // 4. 通过商品名称中的数字匹配
  const nameNumber = extractNumber(product.name);
  if (nameNumber) {
    const nameBasedImage = `/${nameNumber}.png`;
    // 可以尝试这个路径
  }

  // 返回基于 ID 的图片路径（最常见的情况）
  return idBasedImage;
}

/**
 * 从字符串中提取第一个数字
 */
function extractNumber(str: string): number | null {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/**
 * 获取所有可能的本地图片路径（用于回退）
 */
export function getLocalImagePaths(product: WooCommerceStoreProduct): string[] {
  const paths: string[] = [];

  // 基于商品 ID
  paths.push(`/${product.id}.png`);
  paths.push(`/${product.id}.jpg`);

  // 基于 SKU
  if (product.sku) {
    const skuNumber = extractNumber(product.sku);
    if (skuNumber) {
      paths.push(`/${skuNumber}.png`);
      paths.push(`/${skuNumber}.jpg`);
    }
  }

  // 基于商品名称中的数字
  const nameNumber = extractNumber(product.name);
  if (nameNumber) {
    paths.push(`/${nameNumber}.png`);
    paths.push(`/${nameNumber}.jpg`);
  }

  return paths;
}

/**
 * 智能图片匹配：尝试多个路径，返回第一个存在的
 * 注意：这个函数在客户端运行，无法直接检查文件是否存在
 * 但可以通过尝试加载图片来判断
 */
export function getBestProductImage(product: WooCommerceStoreProduct): string | null {
  // 1. 优先使用 API 返回的图片
  if (product.images && product.images.length > 0 && product.images[0].src) {
    const apiImage = product.images[0].src;
    if (apiImage && !apiImage.includes('placeholder') && apiImage !== '') {
      return apiImage;
    }
  }

  // 2. 尝试本地图片（按优先级）
  const localPaths = getLocalImagePaths(product);
  
  // 返回第一个可能的路径（最常见的是基于 ID）
  // 如果图片不存在，Next.js Image 组件会处理错误
  return localPaths[0] || null;
}
