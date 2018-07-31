import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenCompraOrcComponent } from './resumen-compra-orc.component';

describe('ResumenCompraOrcComponent', () => {
  let component: ResumenCompraOrcComponent;
  let fixture: ComponentFixture<ResumenCompraOrcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenCompraOrcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenCompraOrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
