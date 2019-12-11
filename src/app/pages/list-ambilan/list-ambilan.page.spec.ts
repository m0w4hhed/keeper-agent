import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAmbilanPage } from './list-ambilan.page';

describe('ListAmbilanPage', () => {
  let component: ListAmbilanPage;
  let fixture: ComponentFixture<ListAmbilanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAmbilanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAmbilanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
