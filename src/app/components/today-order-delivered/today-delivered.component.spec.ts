import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayDeliveredComponent } from './today-delivered.component';

describe('TodayDeliveredComponent', () => {
  let component: TodayDeliveredComponent;
  let fixture: ComponentFixture<TodayDeliveredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodayDeliveredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayDeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
