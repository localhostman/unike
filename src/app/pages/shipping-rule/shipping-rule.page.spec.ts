import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShippingRulePage } from './shipping-rule.page';

describe('ShippingRulePage', () => {
  let component: ShippingRulePage;
  let fixture: ComponentFixture<ShippingRulePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShippingRulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
