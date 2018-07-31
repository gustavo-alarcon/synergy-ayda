import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosRelacionarComponent } from './procesos-relacionar.component';

describe('ProcesosRelacionarComponent', () => {
  let component: ProcesosRelacionarComponent;
  let fixture: ComponentFixture<ProcesosRelacionarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesosRelacionarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosRelacionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
