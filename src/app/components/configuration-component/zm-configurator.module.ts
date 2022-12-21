import { NgModule } from "@angular/core";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule, Routes } from "@angular/router";
import { ZoneminderConfigurator } from "./zm-configurator.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { CommonComponentModules } from "../components.module";

const routes: Routes = [{ path: '', component: ZoneminderConfigurator }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonComponentModules,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatSliderModule,
  ],
  declarations: [
    ZoneminderConfigurator
  ],
  providers: [RouterModule],
  exports: [RouterModule]
})
export class SettingsModule { }