import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ATF } from 'app/shared/models/atf.model';
import { FormGroup } from '@angular/forms';
import { RegistroAtfComponent } from './modal/registro-atf/registro-atf.component';
import { AtfService } from 'app/service/atf.service';
import { MatDialog } from '@angular/material/dialog';
import { AtfResponse } from 'app/shared/models/response/atf-response';
import { FuseConfigService } from '@fuse/services/config.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-bandeja-atf',
  templateUrl: './bandeja-atf.component.html',
  styleUrls: ['./bandeja-atf.component.scss']
})
export class BandejaATFComponent implements OnInit {

  dataSource = new MatTableDataSource<ATF>([]);
  atfBandeja: FormGroup;
  displayedColumns: string[] = ['ID', 'ATF', 'Acciones'];
  atfResponse: AtfResponse = new AtfResponse();
  atfRequest:  ATF = new ATF();
  resultsLength = 0;
  listATF: ATF[] = [];

  constructor(
    private atfService: AtfService,
    public _dialog: MatDialog,
    private _fuseConfigService: FuseConfigService,) {
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: false
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
    this.atfResponse.pageNumber = 1;
    this.atfResponse.pageSize = 10;
  }

  ngOnInit(): void {
    this.search();
  }

  openModalATF(dataATF: ATF, type: String, index: any) {
    const dialogRef = this._dialog.open(RegistroAtfComponent, {
      width: '1000px',
      height: '360px',
      data: { dataATF: dataATF, type: type }
    });
   // dialogRef.afterClosed().subscribe(result => { })

    dialogRef.afterClosed().subscribe(result => {  
      if (result !== null && result !== -1 && result !== undefined) {
        if(result.type === 'EDIT'){
          this.listATF[index].nombreAtf = result.nombreAtf;
          this.listATF[index].codigoAtf = result.codigoAtf;          

        } else {
          let indexNew = this.listATF.indexOf(result,0);
          if(indexNew === -1){
            this.listATF.push(result);
          }else{
            this.listATF[indexNew] = result;
          }
        };

        this.dataSource = new MatTableDataSource<ATF>(this.listATF);
      }
    })
  }

  search() {
    this.dataSource = new MatTableDataSource<ATF>([])

    this.atfService.getATFSearch(this.atfRequest, this.atfResponse.pageNumber, this.atfResponse.pageSize).subscribe((response: AtfResponse) => {
      if (response.success) {
        this.atfResponse = response;
        this.dataSource = new MatTableDataSource<ATF>(response.data);
        this.resultsLength = response.totalRecords;
      }
    })
  }

  pageDataSource(e: PageEvent): PageEvent {
    debugger
    this.atfResponse.pageNumber = e.pageIndex + 1;
    this.atfResponse.pageSize = e.pageSize;
    this.search();
    return e;
  }


}
