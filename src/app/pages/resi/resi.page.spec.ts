import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResiPage } from './resi.page';

describe('ResiPage', () => {
  let component: ResiPage;
  let fixture: ComponentFixture<ResiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
