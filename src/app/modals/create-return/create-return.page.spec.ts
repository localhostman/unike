import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateReturnPage } from './create-return.page';

describe('CreateReturnPage', () => {
  let component: CreateReturnPage;
  let fixture: ComponentFixture<CreateReturnPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateReturnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
