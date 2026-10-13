import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsItem } from '../news.models';

@Component({
  selector: 'app-news-card',
  imports: [DatePipe, RouterLink],
  template: `
    <a class="news-card" [routerLink]="['/news', news().id]">
      @if (news().imageUrl) {
        <img [src]="news().imageUrl" [alt]="news().imageAlt" loading="lazy" />
      } @else {
        <div class="placeholder"></div>
      }
      <div class="body">
        <div class="meta">
          <time>{{ news().date | date: 'mediumDate' }}</time>
        </div>
        <h3>{{ news().title }}</h3>
        <p>{{ news().brief }}</p>
      </div>
    </a>
  `,
  styles: `
    .news-card { display: flex; flex-direction: column; height: 100%; border: 1px solid #e3e6ec; border-radius: 10px;
      overflow: hidden; background: #fff; color: inherit; text-decoration: none; transition: box-shadow .2s; }
    .news-card:hover { box-shadow: 0 6px 20px rgb(0 0 0 / .08); }
    img, .placeholder { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; background: #eef0f4; }
    .body { padding: 16px; }
    .meta { display: flex; gap: 8px; align-items: center; font-size: 13px; color: #667; }
    h3 { margin: 8px 0; font-size: 18px; }
    p { margin: 0; color: #556; line-height: 1.5; }
  `,
})
export class NewsCard {
  readonly news = input.required<NewsItem>();
}