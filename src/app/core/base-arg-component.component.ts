import {  AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { authActions } from '../enums/enums';
import { BaseIndexedDbConfigurationComponent } from './base-db.component';
import { CoreMainServices } from './core-main-services.service';

@Component({
  template: '',
})

export abstract class BaseCoreUtilsComponent<T> extends BaseIndexedDbConfigurationComponent {
  public token: string;
  private auth$: Subscription;
  public datasource: T;

  constructor(public mainServices: CoreMainServices) {
    super(mainServices.dbService, mainServices.zmService);
    this.auth$ = this.mainServices.auth.getDataChanges().pipe(filter(tt => tt.action === authActions.token)).subscribe(result => {
      this.token = result.payload.access_token;
      this.loadIndexedDbSettings();
    })
    this.datasource = {} as T;
  }

}