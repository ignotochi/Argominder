import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ArgoMinderComponent } from './argominder.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { ComponentsModule } from './components/components.module';

const dbConfig: DBConfig  = {
  name: 'ArgoDB',
  version: 1.0,
  objectStoresMeta: [{
    store: 'settings',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'liveStreamingScale', keypath: 'liveStreamingScale', options: { unique: true } },
    ]
  }]
};

@NgModule({
  declarations: [
  ],
  imports: [
    NgxIndexedDBModule.forRoot(dbConfig),
    BrowserModule,
    HttpClientModule,
    CommonModule,
  ],
  bootstrap: [ArgoMinderComponent],
  exports: [ComponentsModule]
})
export class ArgoMinderModule { }
