import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaPedidosComponent } from './caja-pedidos.component';

describe('CajaPedidosComponent', () => {
  let component: CajaPedidosComponent;
  let fixture: ComponentFixture<CajaPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajaPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
