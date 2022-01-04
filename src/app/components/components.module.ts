import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { StreamPreview } from './preview/stream-preview.component';
import { ArgoMinderComponent } from '../argominder.component';
import { ChangeDetectorConfigurations } from './detectors/configurations.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ZmService } from '../services/zm.service';
import { ChangeDetectorJwt } from './detectors/jwt.service';
import { Auth } from '../services/auth.service';
import { AuthGuardService } from '../services/auth-guard.service';
import {
  AuthGuardService as AuthGuard
} from '../services/auth-guard.service';
import { CommoneInitializer } from '../services/common-initializer.service';
import { BrowserModule } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    ArgoMinderComponent,
    StreamPreview
  ],
  imports: [
    RouterModule.forRoot([
      {
        path: 'live',
        loadChildren: () => import('./streaming/live-steram.module').then(tt => tt.LiveStreamModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(tt => tt.EventModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('./config/settings.module').then(tt => tt.SettingsModule),
        canActivate: [AuthGuard]
      }
    ]),
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [ZmService, ChangeDetectorConfigurations, ChangeDetectorJwt, Auth, AuthGuardService, CommoneInitializer],
  exports: [RouterModule]
})
export class ComponentsModule { }
function routes(routes: any, arg1: { relativeLinkResolution: "legacy"; }): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
  throw new Error('Function not implemented.');
}

