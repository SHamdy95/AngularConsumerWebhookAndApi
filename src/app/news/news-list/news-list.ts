import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { NewsService } from '../news';
import { NewsCard } from '../news-card/news-card';
import { LoadState, NewsPage, toLoadState } from '../news.models';

@Component({
  selector: 'app-news-list',
  imports: [NewsCard, RouterLink],
  template: `
 
    <h1>News</h1>

    @let s = state();
    @switch (s.status) {
      @case ('loading') {
        <p>Loading news…</p>
      }
      @case ('error') {
        <p class="error">Could not load news. Please try again later.</p>
      }
      @case ('ok') {
        @if (s.data.items.length === 0) {
          <p>No news yet.</p>
        } @else {
          <div class="grid">
            @for (item of s.data.items; track item.id) {
              <app-news-card [news]="item" />
            }
          </div>

          @if (s.data.totalPages > 1) {
            <nav class="pager">
              <a [routerLink]="[]" [queryParams]="{ page: s.data.page - 1 }"
                 [class.disabled]="s.data.page <= 1">‹ Previous</a>
              @for (p of pages(); track p) {
                <a [routerLink]="[]" [queryParams]="{ page: p }" [class.active]="p === s.data.page">{{ p }}</a>
              }
              <a [routerLink]="[]" [queryParams]="{ page: s.data.page + 1 }"
                 [class.disabled]="s.data.page >= s.data.totalPages">Next ›</a>
            </nav>
          }
        }
      }
    }
      
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .pager { display: flex; gap: 8px; justify-content: center; margin-top: 32px; flex-wrap: wrap; }
    .pager a { padding: 6px 12px; border: 1px solid #d5d9e2; border-radius: 6px; text-decoration: none; color: #3544b1; }
    .pager a.active { background: #3544b1; color: #fff; }
    .pager a.disabled { pointer-events: none; opacity: .4; }
    .error { color: #b42318; }
  `,
})
export class NewsList {
  private readonly newsService = inject(NewsService);

  /** Bound from ?page=2 (needs withComponentInputBinding in app.config.ts) */
  readonly page = input(1, { transform: (v: unknown) => numberAttribute(v, 1) });

  protected readonly state = toSignal(
    toObservable(this.page).pipe(switchMap((page) => this.newsService.getPage(page).pipe(toLoadState<NewsPage>()))),
    { initialValue: { status: 'loading' } as LoadState<NewsPage> },
  );

  protected readonly pages = computed(() => {
    const s = this.state();
    return s.status === 'ok' ? Array.from({ length: s.data.totalPages }, (_, i) => i + 1) : [];
  });
}