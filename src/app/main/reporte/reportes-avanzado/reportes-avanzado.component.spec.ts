import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesAvanzadoComponent } from './reportes-avanzado.component';

describe('ReportesAvanzadoComponent', () => {
  let component: ReportesAvanzadoComponent;
  let fixture: ComponentFixture<ReportesAvanzadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesAvanzadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesAvanzadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
