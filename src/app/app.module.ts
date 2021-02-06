import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import ja from '@angular/common/locales/ja';
import { registerLocaleData } from '@angular/common';
import * as Highcharts from 'highcharts';
import HC_sunburst from 'highcharts/modules/sunburst';

import { NZ_I18N, ja_JP } from 'ng-zorro-antd/i18n';

HC_sunburst(Highcharts);
registerLocaleData(ja);
@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ScrollingModule,
    DragDropModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: NZ_I18N, useValue: ja_JP }
  ]
})
export class AppModule { }
