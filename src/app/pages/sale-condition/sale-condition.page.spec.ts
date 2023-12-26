import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleConditionPage } from './sale-condition.page';

describe('SaleConditionPage', () => {
  let component: SaleConditionPage;
  let fixture: ComponentFixture<SaleConditionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SaleConditionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
