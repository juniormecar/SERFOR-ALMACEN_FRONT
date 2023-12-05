import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaunaSalidaComponent } from './fauna-salida.component';

describe('FaunaSalidaComponent', () => {
  let component: FaunaSalidaComponent;
  let fixture: ComponentFixture<FaunaSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaunaSalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaunaSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
