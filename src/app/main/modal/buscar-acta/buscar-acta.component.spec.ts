import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarActaComponent } from './buscar-acta.component';

describe('BuscarActaComponent', () => {
  let component: BuscarActaComponent;
  let fixture: ComponentFixture<BuscarActaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarActaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarActaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
