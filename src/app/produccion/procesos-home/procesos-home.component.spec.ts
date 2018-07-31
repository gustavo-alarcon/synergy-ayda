import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosHomeComponent } from './procesos-home.component';

describe('ProcesosHomeComponent', () => {
  let component: ProcesosHomeComponent;
  let fixture: ComponentFixture<ProcesosHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesosHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
