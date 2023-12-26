import { TestBed } from '@angular/core/testing';

import { ProductPropService } from './product-prop.service';

describe('ProductPropService', () => {
  let service: ProductPropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductPropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
