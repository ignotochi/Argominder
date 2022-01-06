import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorJwt } from './components/detectors/jwt.service';
import { ChangeDetectorConfigurations } from './components/detectors/configurations.service';
import { Auth } from './services/auth.service';
import { IConfigurationsList } from './interfaces/IConfigurationsList';
import { IEventsFilter } from './interfaces/IEventsFilter';
import { IStreamProperties } from './interfaces/IStreamProperties';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { authActions, Menu } from './enums/enums';

@Component({
  selector: 'argominder',
  templateUrl: './argominder.component.html',
  styleUrls: ['./argominder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArgoMinderComponent implements OnInit, AfterViewInit {
  selectedTab: number = 0;
  loadStream: boolean;
  private auth$: Subscription;

  private configurationsList: IConfigurationsList = {
    camDiapason: [], eventsFilter: {} as IEventsFilter, previewStatus: false, streamingProperties: {} as IStreamProperties
  };

  constructor(private changeRef: ChangeDetectorRef, private configurations: ChangeDetectorConfigurations,
    private auth: ChangeDetectorJwt, public router: Router, public authConf: Auth) {
    this.configurations.initializeDataChanges();
    this.auth.initializeDataChanges();
    this.configurations.setAll(this.configurationsList);

    this.auth$ = this.auth.getDataChanges().pipe(filter(tt => tt.action === authActions.token)).subscribe(() => {
      this.loadStream = this.authConf.login.access_token.length > 0 ? true : false;
      this.changeRef.markForCheck();
    })
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  tabNavigation(tabIndex: number): void {
    switch (tabIndex) {
      case 0:
        this.navigationPath(Menu.Home);
        break;
      case 1:
        this.navigationPath(Menu.Live);
        break;
      case 2:
        this.navigationPath(Menu.Events);
        break;
      case 3:
        this.navigationPath(Menu.Settings);
        break;
      default:
        break;
    }
  }

  navigationPath(menuSelected: Menu): void {
    let path: string;
    switch (menuSelected) {
      case Menu.Home:
        path = Menu.Home;
        break;
      case Menu.Live:
        path = Menu.Live;
        break;
      case Menu.Events:
        path = Menu.Events;
        break;
      case Menu.Settings:
        path = Menu.Settings;
        break;
      default:
        break;
    }
    this.router.navigate([path]);
  }

}