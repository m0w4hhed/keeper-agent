import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTokoPage } from './database-toko.page';

describe('DatabaseTokoPage', () => {
  let component: DatabaseTokoPage;
  let fixture: ComponentFixture<DatabaseTokoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseTokoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseTokoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
