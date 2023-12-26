import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { CanActivateWhenLoginGuard } from './can-activate-when-login.guard';

describe('CanActivateWhenLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateWhenLoginGuard]
    });
  });

  it('should ...', inject([CanActivateWhenLoginGuard], (guard: CanActivateWhenLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
