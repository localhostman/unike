import { TestBed } from '@angular/core/testing';

import { GettablePromoService } from './gettable-promo.service';

describe('GettablePromoService', () => {
  let service: GettablePromoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GettablePromoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
