import { TestBed } from '@angular/core/testing';

import { PeticashService } from './peticash.service';

describe('PeticashService', () => {
  let service: PeticashService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeticashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
