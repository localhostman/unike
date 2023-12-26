import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopadPage } from './topad.page';

describe('TopadPage', () => {
  let component: TopadPage;
  let fixture: ComponentFixture<TopadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TopadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
