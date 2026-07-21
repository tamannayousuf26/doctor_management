import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCreateComponent } from './expense-create.component';

describe('ExpenseCreateComponent', () => {
  let component: ExpenseCreateComponent;
  let fixture: ComponentFixture<ExpenseCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
