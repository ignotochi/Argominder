import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { ConfigComponent } from './config/config.component';
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
import { MatGridListModule } from "@angular/material/grid-list";
import {
  AuthGuardService as AuthGuard
} from '../services/auth-guard.service';
import { CommoneInitializer } from '../services/common-initializer.service';

@NgModule({
  declarations: [
    ArgoMinderComponent,
    ConfigComponent,
    StreamPreview
  ],
  imports: [
    RouterModule.forRoot([
      // {
      //   path: '', 
      //   component: ArgoMinderComponent,
      //   canActivate: [AuthGuard]
      // },
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
    ]),
    FormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatNativeDateModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatGridListModule,
  ],
  providers: [ZmService, ChangeDetectorConfigurations, ChangeDetectorJwt, Auth, AuthGuardService, CommoneInitializer],
  exports: [RouterModule]
})
export class ComponentsModule { }
function routes(routes: any, arg1: { relativeLinkResolution: "legacy"; }): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
  throw new Error('Function not implemented.');
}

