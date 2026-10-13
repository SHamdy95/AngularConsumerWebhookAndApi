
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebhookService } from '../services/webhookService';
@Component({
  selector: 'app-webhook',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Umbraco Webhook Events</h2>

    <button (click)="loadEvents()">
      Refresh Events
    </button>

    <p *ngIf="events.length === 0">
      No events received yet.
    </p>

    <ul>
      <li *ngFor="let event of events">
        <strong>{{ event.eventName }}</strong>
        <pre>{{ event.payload | json }}</pre>
      </li>
    </ul>
  `
})
export class Webhook {
  events: any[] = [];

  constructor(private webhookService: WebhookService) {}

  loadEvents(): void {
    this.webhookService.getEvents().subscribe({
      next: data => {
        this.events = data.map(item => ({
          ...item,
          eventName: item.eventName ?? item.EventName,
          payload: item.payload ?? item.Payload
        }));
      },
      error: err => console.error('Failed to load events', err)
    });
  }
}
