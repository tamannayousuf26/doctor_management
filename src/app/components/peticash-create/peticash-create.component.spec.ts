import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeticashCreateComponent } from './peticash-create.component';

describe('PeticashCreateComponent', () => {
  let component: PeticashCreateComponent;
  let fixture: ComponentFixture<PeticashCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeticashCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeticashCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
