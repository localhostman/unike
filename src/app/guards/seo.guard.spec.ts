import { TestBed } from '@angular/core/testing';

import { SeoGuard } from './seo.guard';

describe('SeoGuard', () => {
  let guard: SeoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SeoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
