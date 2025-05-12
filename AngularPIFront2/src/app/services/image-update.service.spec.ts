import { TestBed } from '@angular/core/testing';

import { ImageUpdateService } from './image-update.service';

describe('ImageUpdateService', () => {
  let service: ImageUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
