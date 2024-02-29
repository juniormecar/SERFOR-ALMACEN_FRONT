import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppViewDocumentsComponent } from './app-view-documents.component';

describe('AppViewDocumentsComponent', () => {
  let component: AppViewDocumentsComponent;
  let fixture: ComponentFixture<AppViewDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppViewDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppViewDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
