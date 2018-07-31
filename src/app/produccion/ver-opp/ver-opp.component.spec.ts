import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerOppComponent } from './ver-opp.component';

describe('VerOppComponent', () => {
  let component: VerOppComponent;
  let fixture: ComponentFixture<VerOppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerOppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerOppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
