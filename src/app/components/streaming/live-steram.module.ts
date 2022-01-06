import { NgModule } from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule, Routes } from "@angular/router";
import { CommonComponentModules } from "../components.module";
import { LiveStreamComponent } from "./live-stream.component";

const routes: Routes = [ { path: '', component: LiveStreamComponent} ]; 

@NgModule({
  imports: [
      RouterModule.forChild(routes),
      CommonComponentModules,
      MatGridListModule,
    ],
    declarations: [
      LiveStreamComponent
    ],
  providers: [RouterModule],
  exports: [RouterModule]
})
export class LiveStreamModule { }
