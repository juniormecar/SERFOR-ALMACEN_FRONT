import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-action-message',
  templateUrl: './action-message.component.html',
  styleUrls: ['./action-message.component.scss']
})
export class ActionMessageComponent implements OnInit, OnDestroy{

  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
      public dialogRefVerificationCode: MatDialogRef<ActionMessageComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _formBuilder: FormBuilder,
      private _changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  }
  
  ngOnDestroy(): void
  {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  accept(){
    this.dialogRefVerificationCode.close(true);
  }

}
