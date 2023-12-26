import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReturnRulePage } from './return-rule.page';

describe('ReturnRulePage', () => {
  let component: ReturnRulePage;
  let fixture: ComponentFixture<ReturnRulePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReturnRulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
