import { TestBed } from '@angular/core/testing';

import { TodayService } from './today.service';

describe('TodayService', () => {
  let service: TodayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
