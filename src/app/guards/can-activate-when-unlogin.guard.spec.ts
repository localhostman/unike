import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { CanActivateWhenUnloginGuard } from './can-activate-when-unlogin.guard';

describe('CanActivateWhenUnloginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateWhenUnloginGuard]
    });
  });

  it('should ...', inject([CanActivateWhenUnloginGuard], (guard: CanActivateWhenUnloginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
