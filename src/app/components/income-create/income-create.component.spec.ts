import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeCreateComponent } from './income-create.component';

describe('IncomeCreateComponent', () => {
  let component: IncomeCreateComponent;
  let fixture: ComponentFixture<IncomeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
