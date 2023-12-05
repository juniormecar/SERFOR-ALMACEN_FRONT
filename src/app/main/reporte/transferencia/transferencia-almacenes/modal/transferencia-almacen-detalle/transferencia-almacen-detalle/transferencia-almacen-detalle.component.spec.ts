import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaAlmacenDetalleComponent } from './transferencia-almacen-detalle.component';

describe('TransferenciaAlmacenDetalleComponent', () => {
  let component: TransferenciaAlmacenDetalleComponent;
  let fixture: ComponentFixture<TransferenciaAlmacenDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferenciaAlmacenDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciaAlmacenDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
