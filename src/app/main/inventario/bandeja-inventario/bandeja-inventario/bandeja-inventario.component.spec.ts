import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaInventarioComponent } from './bandeja-inventario.component';

describe('BandejaInventarioComponent', () => {
  let component: BandejaInventarioComponent;
  let fixture: ComponentFixture<BandejaInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
