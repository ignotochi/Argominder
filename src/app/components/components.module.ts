import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { StreamPreview } from './preview/stream-preview.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

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
    StreamPreview
  ],

  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NgxIndexedDBModule.forRoot(dbConfig),
  ],

  exports: [FormsModule, CommonModule, MatButtonModule, MatInputModule, MatTabsModule, MatButtonToggleModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule]
})
export class CommonComponentModules { }


