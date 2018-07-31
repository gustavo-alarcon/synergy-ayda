import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerOrpComponent } from './ver-orp.component';

describe('VerOrpComponent', () => {
  let component: VerOrpComponent;
  let fixture: ComponentFixture<VerOrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerOrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerOrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
