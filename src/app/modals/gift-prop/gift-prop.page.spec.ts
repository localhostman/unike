import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GiftPropPage } from './gift-prop.page';

describe('GiftPropPage', () => {
  let component: GiftPropPage;
  let fixture: ComponentFixture<GiftPropPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GiftPropPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
