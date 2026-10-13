import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { NewsService } from '../news';
import { NewsCard } from '../news-card/news-card';

/** Reusable widget: <app-latest-news [take]="3" /> */
@Component({
  selector: 'app-latest-news',
  imports: [NewsCard, RouterLink],
  template: `
    <section>
      <header>
        <h2>{{ heading() }}</h2>
        <a routerLink="/news">All news ›</a>
      </header>
      <div class="grid">
        @for (item of items(); track item.id) {
          <app-news-card [news]="item" />
        } @empty {
          <p>No news yet.</p>
        }
      </div>
    </section>
  `,
  styles: `
    header { display: flex; justify-content: space-between; align-items: baseline; }
    header a { color: #3544b1; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  `,
})
export class LatestNews {
  private readonly newsService = inject(NewsService);

  readonly take = input(3);
  readonly excludeId = input<string | undefined>(undefined);
  readonly heading = input('Latest news');

  private readonly params = computed(() => ({ take: this.take(), excludeId: this.excludeId() }));

  protected readonly items = toSignal(
    toObservable(this.params).pipe(switchMap((p) => this.newsService.getLatest(p.take, p.excludeId))),
    { initialValue: [] },
  );
}