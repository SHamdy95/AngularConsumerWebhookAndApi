import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel
} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class WebhookService {
  private apiUrl =
    'https://localhost:44396/api/webhooks/events';

  private hubUrl =
    'https://localhost:44396/hubs/webhook';

  private connection?: HubConnection;

  private eventSubject = new Subject<any>();

  // Components can subscribe to incoming events.
  readonly events$ = this.eventSubject.asObservable();

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  async connect(): Promise<void> {
    if (this.connection?.state === 'Connected') {
      return;
    }

    if (this.connection?.state === 'Connecting') {
      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // IMPORTANT:
    // Replace 'ContentChanged' with the actual event
    // name sent by your ASP.NET Core Hub.
    this.connection.on('WebhookEventReceived', (event: any) => {
      console.log('[SignalR] New event received:', event);
      this.eventSubject.next(event);
    });

    this.connection.onreconnecting(error => {
      console.warn('[SignalR] Reconnecting:', error);
    });

    this.connection.onreconnected(connectionId => {
      console.log('[SignalR] Reconnected:', connectionId);
    });

    this.connection.onclose(error => {
      console.warn('[SignalR] Connection closed:', error);
    });

    try {
      await this.connection.start();
      console.log('[SignalR] Connected successfully');
    } catch (error) {
      console.error('[SignalR] Connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = undefined;
    }
  }
}