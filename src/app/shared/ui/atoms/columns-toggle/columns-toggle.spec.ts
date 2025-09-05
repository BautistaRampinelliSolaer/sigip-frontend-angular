import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsToggle } from './columns-toggle';

describe('ColumnsToggle', () => {
  let component: ColumnsToggle;
  let fixture: ComponentFixture<ColumnsToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnsToggle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnsToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
