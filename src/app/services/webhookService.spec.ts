import { TestBed } from '@angular/core/testing';
import { WebhookService } from './webhookService';

describe('WebhookService', () => {
  let service: WebhookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebhookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
