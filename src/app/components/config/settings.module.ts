import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule, Routes } from "@angular/router";
import { ConfigComponent } from "./config.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const routes: Routes = [{ path: '', component: ConfigComponent }];

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatSliderModule,
    MatSlideToggleModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    ConfigComponent
  ],
  providers: [RouterModule],
  exports: [RouterModule]
})
export class SettingsModule { }