import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCreateComponent } from './client-create.component';

describe('ClientCreateComponent', () => {
  let component: ClientCreateComponent;
  let fixture: ComponentFixture<ClientCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
