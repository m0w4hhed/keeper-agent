import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateResiPage } from './update-resi.page';

describe('UpdateResiPage', () => {
  let component: UpdateResiPage;
  let fixture: ComponentFixture<UpdateResiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateResiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateResiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
