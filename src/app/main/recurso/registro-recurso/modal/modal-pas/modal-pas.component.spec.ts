import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPasComponent } from './modal-pas.component';

describe('ModalPasComponent', () => {
  let component: ModalPasComponent;
  let fixture: ComponentFixture<ModalPasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
