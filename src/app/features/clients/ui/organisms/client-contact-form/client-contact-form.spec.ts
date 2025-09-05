import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientContactForm } from './client-contact-form';

describe('ClientContactForm', () => {
  let component: ClientContactForm;
  let fixture: ComponentFixture<ClientContactForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientContactForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientContactForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
