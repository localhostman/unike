import { TestBed } from '@angular/core/testing';

import { InsService } from './ins.service';

describe('InsService', () => {
  let service: InsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
