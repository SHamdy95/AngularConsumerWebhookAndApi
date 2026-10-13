import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UmbracoService } from '../umbraco/umbraco';
import { NEWS_CONFIG, NewsItem, NewsPage, toNewsItem } from './news.models';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly umbraco = inject(UmbracoService);

  /** All "new" items from every container, newest first */
  getPage(page = 1, pageSize = NEWS_CONFIG.pageSize): Observable<NewsPage> {
    const current = Math.max(1, page);
    return this.umbraco
      .query({
        filter: [`contentType:${NEWS_CONFIG.itemType}`],
        sort: ['createDate:desc'],
        skip: (current - 1) * pageSize,
        take: pageSize,
      })
      .pipe(
        map((r) => ({
          items: r.items.map(toNewsItem),
          total: r.total,
          page: current,
          totalPages: Math.max(1, Math.ceil(r.total / pageSize)),
        })),
      );
  }

  /** One news item by id */
  getById(id: string): Observable<NewsItem> {
    return this.umbraco.getById(id).pipe(map(toNewsItem));
  }

  /** Latest N items with "Show in home page" ticked */
  getLatest(take = 3, excludeId?: string): Observable<NewsItem[]> {
    return this.getPage(1, 50).pipe(
      map((p) => p.items.filter((n) => n.showInHomePage && n.id !== excludeId).slice(0, take)),
    );
  }
}