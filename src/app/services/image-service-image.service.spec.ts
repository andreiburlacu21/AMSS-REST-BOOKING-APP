import { TestBed } from '@angular/core/testing';

import { ImageServiceImageService } from './image-service-image.service';

describe('ImageServiceImageService', () => {
  let service: ImageServiceImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageServiceImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
