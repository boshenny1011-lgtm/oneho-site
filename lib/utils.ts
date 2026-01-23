import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNgrokImageUrl(imageUrl: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://linexpv.com';

  let url = imageUrl;

  if (url.match(/https?:\/\/[^\/]*onehonl\.local(:443)?/)) {
    url = url.replace(/https?:\/\/[^\/]*onehonl\.local(:443)?/, siteUrl);
  }

  return url;
}
