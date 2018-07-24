import { StarterComponent } from '../starter/starter.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MasterComponent } from '../master/master.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: '/starter', pathMatch: 'full' },
            { path: 'starter', component: StarterComponent },
            { path: 'file-upload', component: FileUploadComponent },
            { path: 'dynamic-table', component: DynamicTableComponent },
            { path: '**', component: StarterComponent },
        ])
    ],
    declarations: [],
    exports: [RouterModule]
})

export class AppRoutingModule { }