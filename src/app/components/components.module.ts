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

@NgModule({
  declarations: [
    StreamPreview
  ],

  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
  ],

  exports: [FormsModule, CommonModule, MatButtonModule, MatInputModule, MatTabsModule, MatButtonToggleModule, MatIconModule, MatDialogModule]
})
export class CommonComponentModules { }


