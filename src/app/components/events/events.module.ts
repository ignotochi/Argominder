import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventsComponentDetail } from "./events.component";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from "@angular/material/sort";
import { CommonComponentModules } from "../components.module";

const routes: Routes = [ { path: '', component: EventsComponentDetail} ]; 

@NgModule({
  imports: [
      RouterModule.forChild(routes),
      CommonComponentModules,
      MatPaginatorModule,
      MatTableModule,
      MatSortModule,
    ],
    declarations: [
      EventsComponentDetail
    ],
  providers: [RouterModule],
  exports: [RouterModule]
})
export class EventModule { }
