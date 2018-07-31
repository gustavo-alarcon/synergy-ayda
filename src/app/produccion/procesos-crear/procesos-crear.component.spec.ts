import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosCrearComponent } from './procesos-crear.component';

describe('ProcesosCrearComponent', () => {
  let component: ProcesosCrearComponent;
  let fixture: ComponentFixture<ProcesosCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesosCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
