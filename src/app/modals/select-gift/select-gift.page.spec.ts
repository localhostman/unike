import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectGiftPage } from './select-gift.page';

describe('SelectGiftPage', () => {
  let component: SelectGiftPage;
  let fixture: ComponentFixture<SelectGiftPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SelectGiftPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
