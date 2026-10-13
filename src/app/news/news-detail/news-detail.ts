import { Component, effect, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { NewsService } from '../news';
import { LatestNews } from '../latest-news/latest-news';
import { LoadState, NewsItem, toLoadState } from '../news.models';

@Component({
  selector: 'app-news-detail',
  imports: [DatePipe, RouterLink, LatestNews],
  template: `
    <a routerLink="/news" class="back">‹ Back to news</a>

    @let s = state();
    @switch (s.status) {
      @case ('loading') {
        <p>Loading…</p>
      }
      @case ('error') {
        <h1>{{ s.notFound ? 'News not found' : 'Something went wrong' }}</h1>
      }
      @case ('ok') {
        <article>
          <div class="meta">
            <time>{{ s.data.date | date: 'longDate' }}</time>
          </div>
          <h1>{{ s.data.title }}</h1>
          @if (s.data.brief) {
            <p class="lead">{{ s.data.brief }}</p>
          }
          @if (s.data.imageUrl) {
            <img [src]="s.data.imageUrl" [alt]="s.data.imageAlt" />
          }
          @if (s.data.bodyHtml) {
            <div class="content" [innerHTML]="s.data.bodyHtml"></div>
          }
        </article>

        <app-latest-news heading="More news" [excludeId]="s.data.id" />
      }
    }
  `,
  styles: `
    .back { color: #3544b1; display: inline-block; margin-bottom: 16px; }
    article { max-width: 780px; margin-bottom: 48px; }
    .meta { display: flex; gap: 8px; align-items: center; color: #667; font-size: 14px; }
    h1 { margin: 8px 0 12px; }
    .lead { font-size: 19px; color: #556; }
    img { width: 100%; max-width: 780px; border-radius: 10px; margin: 16px 0; }
    .content { line-height: 1.7; }
  `,
})
export class NewsDetail {
  private readonly newsService = inject(NewsService);
  private readonly title = inject(Title);

  /** Bound from the route 'news/:id' */
  readonly id = input.required<string>();

  protected readonly state = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.newsService.getById(id).pipe(toLoadState<NewsItem>()))),
    { initialValue: { status: 'loading' } as LoadState<NewsItem> },
  );

  constructor() {
    effect(() => {
      const s = this.state();
      if (s.status === 'ok') this.title.setTitle(s.data.title);
    });
  }
}