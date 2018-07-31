import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialDetalleComponent } from './historial-detalle.component';

describe('HistorialDetalleComponent', () => {
  let component: HistorialDetalleComponent;
  let fixture: ComponentFixture<HistorialDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
