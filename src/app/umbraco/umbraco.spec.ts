import { TestBed } from '@angular/core/testing';
import { UmbracoService } from './umbraco';

describe('Umbraco', () => {
  let service: UmbracoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UmbracoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
