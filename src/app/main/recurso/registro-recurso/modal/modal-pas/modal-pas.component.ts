import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  nroActa: string
}
@Component({
  selector: 'app-modal-pas',
  templateUrl: './modal-pas.component.html',
  styleUrls: ['./modal-pas.component.scss']
})
export class ModalPasComponent implements OnInit {

  /**
     * Constructor
     *
     * @param {MatDialogRef<ModalActaIntervencionComponent>} dialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    public dialogRef: MatDialogRef<ModalPasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(-1);
  }

}
