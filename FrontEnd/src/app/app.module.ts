import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SendboxComponent } from './sendbox/sendbox.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { SplitButtonModule, ProgressButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { FormsModule } from '@angular/forms';
import { TestuploadComponent } from './testupload/testupload.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
@NgModule({
  declarations: [
    AppComponent,SendboxComponent, TestuploadComponent
  ],
  imports: [
    BrowserModule,
    RichTextEditorModule,
    HttpClientModule,
    SplitButtonModule ,
    ProgressButtonModule ,
    UploaderModule,
    DialogModule,
    ButtonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
