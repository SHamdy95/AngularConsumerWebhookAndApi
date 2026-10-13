import { Observable, catchError, map, of, startWith } from 'rxjs';
import { environment } from '../../environments/environment';
import { UmbracoContent } from '../umbraco/umbraco.models';

export const NEWS_CONFIG = {
  itemType: 'new',      // document type alias of a news item
  pageSize: 9,
};

export interface NewsItem {
  id: string;
  title: string;
  brief: string;
  date: string;
  imageUrl?: string;
  imageAlt: string;
  bodyHtml: string;
  showInHomePage: boolean;
  expiryDate?: string;
}

export interface NewsPage {
  items: NewsItem[];
  total: number;
  page: number;
  totalPages: number;
}

/** Maps a Delivery API "new" item to NewsItem */
export function toNewsItem(c: UmbracoContent): NewsItem {
  const p = c.properties ?? {};
  const image = Array.isArray(p['image']) ? p['image'][0] : p['image'];

  return {
    id: c.id,
    title: p['title'] || c.name,
    brief: p['brief'] ?? '',
    date: p['publishDate'] || c.createDate,
    imageUrl: image?.url ? absoluteMediaUrl(image.url) : undefined,
    imageAlt: image?.name ?? '',
    // only if you add a rich text property with alias "body" later
    bodyHtml: (p['body']?.markup ?? '').replaceAll('src="/media/', `src="${environment.umbracoUrl}/media/`),
    showInHomePage: p['showInHomePage'] === true,
    expiryDate: p['expiryDate'] ?? undefined,
  };
}

export function absoluteMediaUrl(url: string, width?: number): string {
  const full = url.startsWith('http') ? url : `${environment.umbracoUrl}${url}`;
  return width ? `${full}?width=${width}` : full;
}

export type LoadState<T> =
  | { status: 'loading' }
  | { status: 'ok'; data: T }
  | { status: 'error'; notFound: boolean };

export function toLoadState<T>() {
  return (source: Observable<T>): Observable<LoadState<T>> =>
    source.pipe(
      map((data): LoadState<T> => ({ status: 'ok', data })),
      catchError((e) => of<LoadState<T>>({ status: 'error', notFound: e?.status === 404 })),
      startWith<LoadState<T>>({ status: 'loading' }),
    );
}