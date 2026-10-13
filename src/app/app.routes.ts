import { Routes } from '@angular/router';
import { NewsList } from './news/news-list/news-list';
import { NewsDetail } from './news/news-detail/news-detail';
import { Webhook } from './webhook/webhook';
import { SigRcComponent  } from './sig-rc/sig-rc';

export const routes: Routes = [
     { path: 'news', component: NewsList, title: 'News' },
  { path: 'news/:id', component: NewsDetail },
  { path: 'webhooks', component: Webhook },
{ path: 'sig-rc', component: SigRcComponent  },
];
