import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarangKeluarPage } from './barang-keluar.page';

describe('BarangKeluarPage', () => {
  let component: BarangKeluarPage;
  let fixture: ComponentFixture<BarangKeluarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarangKeluarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarangKeluarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
