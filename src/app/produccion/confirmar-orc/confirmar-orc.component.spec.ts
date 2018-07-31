import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarOrcComponent } from './confirmar-orc.component';

describe('ConfirmarOrcComponent', () => {
  let component: ConfirmarOrcComponent;
  let fixture: ComponentFixture<ConfirmarOrcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarOrcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarOrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
