import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientesPedidosComponent } from './add-clientes-pedidos.component';

describe('AddClientesPedidosComponent', () => {
  let component: AddClientesPedidosComponent;
  let fixture: ComponentFixture<AddClientesPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClientesPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClientesPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
