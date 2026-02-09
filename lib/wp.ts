/**
 * WordPress / WooCommerce 统一 Base URL
 * 所有 API 请求使用此常量，避免硬编码
 */
export const WORDPRESS_BASE_URL =
  (typeof process !== 'undefined' && process.env?.WC_BASE_URL) ||
  'https://wp.linexpv.com';

/**
 * 规范化 Base URL：移除末尾斜杠
 */
export function normalizeWordPressUrl(url: string): string {
  return url.replace(/\/$/, '');
}
