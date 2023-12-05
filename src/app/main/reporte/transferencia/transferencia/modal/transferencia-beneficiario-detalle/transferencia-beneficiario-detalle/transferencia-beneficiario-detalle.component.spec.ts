import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaBeneficiarioDetalleComponent } from './transferencia-beneficiario-detalle.component';

describe('TransferenciaBeneficiarioDetalleComponent', () => {
  let component: TransferenciaBeneficiarioDetalleComponent;
  let fixture: ComponentFixture<TransferenciaBeneficiarioDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferenciaBeneficiarioDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciaBeneficiarioDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
