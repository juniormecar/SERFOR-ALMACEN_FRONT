import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableViewDocumentsComponent } from './table-view-documents.component';

describe('TableViewDocumentsComponent', () => {
  let component: TableViewDocumentsComponent;
  let fixture: ComponentFixture<TableViewDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableViewDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableViewDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
