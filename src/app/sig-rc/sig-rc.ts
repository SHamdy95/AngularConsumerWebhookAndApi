import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectorRef,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { Subscription } from 'rxjs';
import { WebhookService } from '../services/webhookService';

interface WebhookEvent {
  receivedAt: string;
  eventName: string;
  payload: unknown;
}

@Component({
  selector: 'app-sig-rc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sig-rc.html',
  styleUrl: './sig-rc.css'
})
export class SigRcComponent implements OnInit, OnDestroy {
  events: WebhookEvent[] = [];
  connected = false;

  private eventSubscription?: Subscription;

  constructor(
    private webhookService: WebhookService,
    @Inject(PLATFORM_ID) private platformId: object,
      private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    console.log('[Component] Initializing webhook events');

    // Load events already stored by the backend.
    this.webhookService.getEvents().subscribe({
      next: (data: WebhookEvent[]) => {
        console.log('[API] Events loaded:', data);

        // Program.cs returns newest events first.
        this.events = data;
      },
      error: (err: unknown) => {
        console.error('[API] Could not load events:', err);
      }
    });

    // Subscribe BEFORE connecting to SignalR.
    this.eventSubscription = this.webhookService.events$.subscribe({
      next: (event: WebhookEvent) => {
        console.log('[Component] Real-time event received:', event);

        this.events = [event, ...this.events].slice(0, 20);
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        console.error('[Component] Event stream error:', err);
      }
       
    }
  );

    try {
      await this.webhookService.connect();
      this.connected = true;
      console.log('[Component] SignalR ready');
    } catch (error) {
      this.connected = false;
      console.error('[Component] SignalR connection failed:', error);
    }
  }

  ngOnDestroy(): void {
    this.eventSubscription?.unsubscribe();

    // Do not disconnect the shared service here.
  }

  countEvents(eventName: string): number {
  return this.events.filter(
    event => event.eventName === eventName
  ).length;
}

getContentId(payload: unknown): string {
  if (
    payload !== null &&
    typeof payload === 'object' &&
    'id' in payload
  ) {
    return String(payload.id);
  }

  return 'Not provided by webhook';
}
}