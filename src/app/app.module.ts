import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { MasterComponent } from './master/master.component';
import { StarterComponent } from './starter/starter.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { Http, HttpModule } from '@angular/http';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';


@NgModule({
  declarations: [
    AppComponent,
    DragDropComponent,
    MasterComponent,
    StarterComponent,
    FileUploadComponent,
    DynamicTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
