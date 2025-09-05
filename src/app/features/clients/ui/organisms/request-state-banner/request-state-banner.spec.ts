import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStateBanner } from './request-state-banner';

describe('RequestStateBanner', () => {
  let component: RequestStateBanner;
  let fixture: ComponentFixture<RequestStateBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestStateBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestStateBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
