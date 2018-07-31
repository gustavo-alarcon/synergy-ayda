import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarOppComponent } from './generar-opp.component';

describe('GenerarOppComponent', () => {
  let component: GenerarOppComponent;
  let fixture: ComponentFixture<GenerarOppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarOppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarOppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
