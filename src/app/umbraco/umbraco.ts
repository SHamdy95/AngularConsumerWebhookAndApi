import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { UmbracoContent, UmbracoMedia, UmbracoPagedResult, UmbracoQuery } from './umbraco.models';

@Injectable({ providedIn: 'root' })
export class UmbracoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.umbracoUrl}${environment.deliveryApiPath}`;

  /** Get one page by its URL path, e.g. 'blog/my-first-post' */
  getByPath(path: string, expand = 'properties[$all]', culture = environment.culture): Observable<UmbracoContent> {
    return this.http.get<UmbracoContent>(`${this.baseUrl}/content/item/${this.clean(path)}`, {
      headers: this.headers(culture),
      params: { expand },
    });
  }

  /** Get one page by its GUID */
  getById(id: string, expand = 'properties[$all]', culture = environment.culture): Observable<UmbracoContent> {
    return this.http.get<UmbracoContent>(`${this.baseUrl}/content/item/${id}`, {
      headers: this.headers(culture),
      params: { expand },
    });
  }

  /** Get several items by GUID in one call */
  getByIds(ids: string[], culture = environment.culture): Observable<UmbracoContent[]> {
    let params = new HttpParams();
    ids.forEach((id) => (params = params.append('id', id)));
    return this.http.get<UmbracoContent[]>(`${this.baseUrl}/content/items`, { headers: this.headers(culture), params });
  }

  /** Query: list / filter / sort / paginate */
  query(q: UmbracoQuery, culture = environment.culture): Observable<UmbracoPagedResult> {
    let params = new HttpParams();
    if (q.fetch) params = params.set('fetch', q.fetch);
    q.filter?.forEach((f) => (params = params.append('filter', f)));
    q.sort?.forEach((s) => (params = params.append('sort', s)));
    params = params.set('skip', q.skip ?? 0).set('take', q.take ?? 10);
    if (q.expand) params = params.set('expand', q.expand);
    if (q.fields) params = params.set('fields', q.fields);

    return this.http.get<UmbracoPagedResult>(`${this.baseUrl}/content`, { headers: this.headers(culture), params });
  }

  /** Children of a page, e.g. getChildren('blog', 'article') */
  getChildren(parentPath: string, contentType?: string, skip = 0, take = 10): Observable<UmbracoPagedResult> {
    return this.query({
      fetch: `children:/${this.clean(parentPath)}`,
      filter: contentType ? [`contentType:${contentType}`] : [],
      sort: ['createDate:desc'],
      skip,
      take,
    });
  }

  /** Media item by path or id */
  getMedia(pathOrId: string): Observable<UmbracoMedia> {
    return this.http.get<UmbracoMedia>(`${this.baseUrl}/media/item/${this.clean(pathOrId)}`);
  }

  /** Build a full image URL (supports ImageSharp crops) */
  imageUrl(media: { url: string } | null | undefined, width?: number, height?: number): string {
    if (!media?.url) return '';
    const p = new URLSearchParams();
    if (width) p.set('width', String(width));
    if (height) p.set('height', String(height));
    const qs = p.toString();
    return `${environment.umbracoUrl}${media.url}${qs ? '?' + qs : ''}`;
  }

  private headers(culture?: string): HttpHeaders {
    let h = new HttpHeaders();
    if (culture) h = h.set('Accept-Language', culture);
    return h;
  }

  private clean(path: string): string {
    return encodeURI((path ?? '').trim().replace(/^\/+|\/+$/g, ''));
  }
}
