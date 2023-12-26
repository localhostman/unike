import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReturnDetailPage } from './return-detail.page';

describe('ReturnDetailPage', () => {
  let component: ReturnDetailPage;
  let fixture: ComponentFixture<ReturnDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReturnDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
