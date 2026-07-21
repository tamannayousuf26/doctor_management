import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetListComponent } from './asset-list.component';

describe('AssetListComponent', () => {
  let component: AssetListComponent;
  let fixture: ComponentFixture<AssetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
