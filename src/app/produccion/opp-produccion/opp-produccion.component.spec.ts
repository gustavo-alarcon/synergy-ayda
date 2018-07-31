import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppProduccionComponent } from './opp-produccion.component';

describe('OppProduccionComponent', () => {
  let component: OppProduccionComponent;
  let fixture: ComponentFixture<OppProduccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppProduccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
