import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAmbilanPage } from './print-ambilan.page';

describe('PrintAmbilanPage', () => {
  let component: PrintAmbilanPage;
  let fixture: ComponentFixture<PrintAmbilanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintAmbilanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAmbilanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
