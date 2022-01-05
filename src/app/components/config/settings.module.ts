import { NgModule } from "@angular/core";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule, Routes } from "@angular/router";
import { ConfigComponent } from "./config.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { CommonComponentModules } from "../components.module";
import { DBConfig, NgxIndexedDBModule } from "ngx-indexed-db";


const routes: Routes = [{ path: '', component: ConfigComponent }];

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
  imports: [
    NgxIndexedDBModule.forRoot(dbConfig),
    RouterModule.forChild(routes),
    CommonComponentModules,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatSliderModule,
  ],
  declarations: [
    ConfigComponent
  ],
  providers: [RouterModule],
  exports: [RouterModule]
})
export class SettingsModule { }