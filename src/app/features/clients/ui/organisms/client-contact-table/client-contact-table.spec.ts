import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientContactTable } from './client-contact-table';

describe('ClientContactTable', () => {
  let component: ClientContactTable;
  let fixture: ComponentFixture<ClientContactTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientContactTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientContactTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
