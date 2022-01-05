import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ArgoMinderComponent } from './argominder.component';
import { CommonComponentModules } from './components/components.module';
import { ChangeDetectorConfigurations } from './components/detectors/configurations.service';
import { ChangeDetectorJwt } from './components/detectors/jwt.service';
import { AuthGuardService as AuthGuard, AuthGuardService } from './services/auth-guard.service';
import { Auth } from './services/auth.service';
import { CommoneInitializer } from './services/common-initializer.service';
import { ZmService } from './services/zm.service';

@NgModule({
  declarations: [
    ArgoMinderComponent
  ],

  imports: [
    RouterModule.forRoot([
      {
        path: 'live',
        loadChildren: () => import('./components/streaming/live-steram.module').then(tt => tt.LiveStreamModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'events',
        loadChildren: () => import('./components/events/events.module').then(tt => tt.EventModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('./components/config/settings.module').then(tt => tt.SettingsModule),
        canActivate: [AuthGuard]
      }
    ]),
    
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonComponentModules
  ],
  bootstrap: [ArgoMinderComponent],
  providers: [ZmService, Auth, AuthGuardService, CommoneInitializer, ChangeDetectorJwt, ChangeDetectorConfigurations],
  exports: [RouterModule]
})
export class ArgoMinderModule { }

