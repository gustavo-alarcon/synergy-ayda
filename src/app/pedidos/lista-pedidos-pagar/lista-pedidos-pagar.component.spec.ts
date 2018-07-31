import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPedidosPagarComponent } from './lista-pedidos-pagar.component';

describe('ListaPedidosPagarComponent', () => {
  let component: ListaPedidosPagarComponent;
  let fixture: ComponentFixture<ListaPedidosPagarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPedidosPagarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPedidosPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
