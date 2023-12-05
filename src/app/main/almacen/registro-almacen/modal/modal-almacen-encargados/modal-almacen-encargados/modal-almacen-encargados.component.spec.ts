import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAlmacenEncargadosComponent } from './modal-almacen-encargados.component';

describe('ModalAlmacenEncargadosComponent', () => {
  let component: ModalAlmacenEncargadosComponent;
  let fixture: ComponentFixture<ModalAlmacenEncargadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAlmacenEncargadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAlmacenEncargadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
