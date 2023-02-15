import { NgModule } from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { RouterModule, Routes } from "@angular/router";
import { CommonComponentModules } from "../components.module";
import { ZoneminderLiveStreaming } from "./live-stream.component";

const routes: Routes = [ { path: '', component: ZoneminderLiveStreaming} ]; 

@NgModule({
  imports: [
      RouterModule.forChild(routes),
      CommonComponentModules,
      MatGridListModule,
    ],
    declarations: [
      ZoneminderLiveStreaming
    ],
  providers: [RouterModule],
  exports: [RouterModule]
})
export class LiveStreamModule { }
