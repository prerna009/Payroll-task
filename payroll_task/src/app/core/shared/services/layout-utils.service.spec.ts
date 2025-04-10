import { TestBed } from '@angular/core/testing';

import { LayoutUtilsService } from './layout-utils.service';

describe('LayoutUtilsService', () => {
  let service: LayoutUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
