import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearClienteProduccionComponent } from './crear-cliente-produccion.component';

describe('CrearClienteProduccionComponent', () => {
  let component: CrearClienteProduccionComponent;
  let fixture: ComponentFixture<CrearClienteProduccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearClienteProduccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearClienteProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
