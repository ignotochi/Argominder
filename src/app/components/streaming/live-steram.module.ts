import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { RouterModule, Routes } from "@angular/router";
import { LiveStreamComponent } from "./live-stream.component";

const routes: Routes = [ { path: '', component: LiveStreamComponent} ]; 

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(routes), 
      MatGridListModule
    ],
    declarations: [
      LiveStreamComponent
    ],
  providers: [RouterModule],
  exports: [RouterModule]
})
export class LiveStreamModule { }
