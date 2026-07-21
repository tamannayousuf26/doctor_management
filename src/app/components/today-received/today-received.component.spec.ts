import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayReceivedComponent } from './today-received.component';

describe('TodayReceivedComponent', () => {
  let component: TodayReceivedComponent;
  let fixture: ComponentFixture<TodayReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodayReceivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
