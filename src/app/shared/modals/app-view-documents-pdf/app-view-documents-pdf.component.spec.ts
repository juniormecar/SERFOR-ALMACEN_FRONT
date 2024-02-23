import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppViewDocumentsPdfComponent } from './app-view-documents-pdf.component';

describe('AppViewDocumentsPdfComponent', () => {
  let component: AppViewDocumentsPdfComponent;
  let fixture: ComponentFixture<AppViewDocumentsPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppViewDocumentsPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppViewDocumentsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
