import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarOrpComponent } from './generar-orp.component';

describe('GenerarOrpComponent', () => {
  let component: GenerarOrpComponent;
  let fixture: ComponentFixture<GenerarOrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarOrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarOrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
