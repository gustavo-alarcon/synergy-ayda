import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesHomeComponent } from './materiales-home.component';

describe('MaterialesHomeComponent', () => {
  let component: MaterialesHomeComponent;
  let fixture: ComponentFixture<MaterialesHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialesHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
