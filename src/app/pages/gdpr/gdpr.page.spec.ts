import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GdprPage } from './gdpr.page';

describe('GdprPage', () => {
  let component: GdprPage;
  let fixture: ComponentFixture<GdprPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GdprPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
