import { TestBed } from '@angular/core/testing';

import { SendserviceService } from './sendservice.service';

describe('SendserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendserviceService = TestBed.get(SendserviceService);
    expect(service).toBeTruthy();
  });
});
