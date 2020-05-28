import { TestBed } from '@angular/core/testing';

import { AuthGuardProfesionalService } from './auth-guard-profesional.service';

describe('AuthGuardProfesionalService', () => {
  let service: AuthGuardProfesionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardProfesionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
