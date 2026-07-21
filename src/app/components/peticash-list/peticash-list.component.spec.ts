import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeticashListComponent } from './peticash-list.component';

describe('PeticashListComponent', () => {
  let component: PeticashListComponent;
  let fixture: ComponentFixture<PeticashListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeticashListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeticashListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
