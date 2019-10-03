import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarangMasukPage } from './barang-masuk.page';

describe('BarangMasukPage', () => {
  let component: BarangMasukPage;
  let fixture: ComponentFixture<BarangMasukPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarangMasukPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarangMasukPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
