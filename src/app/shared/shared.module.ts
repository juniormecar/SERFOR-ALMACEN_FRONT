
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleRecursosComponent } from './modals/detalle-recursos/detalle-recursos.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
    declarations: [
        DetalleRecursosComponent
    ],
    imports: [ CommonModule,
        MatTableModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatRadioModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule, ],
    exports: [DetalleRecursosComponent]
})

export class SharedModule {}