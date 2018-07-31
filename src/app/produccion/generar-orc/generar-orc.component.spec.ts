import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarOrcComponent } from './generar-orc.component';

describe('GenerarOrcComponent', () => {
  let component: GenerarOrcComponent;
  let fixture: ComponentFixture<GenerarOrcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarOrcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarOrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
