import {  AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ChangeDetectorJwt } from '../components/detectors/jwt.service';
import { authActions } from '../enums/enums';
import { ZmService } from '../services/zm.service';
import { BaseIndexedDbConfigurationComponent } from './base-db.component';

@Component({
  template: '',
})

export abstract class BaseArgComponent<T> extends BaseIndexedDbConfigurationComponent {
  public token: string;
  private auth$: Subscription;
  public datasource: T;

  constructor(public dbService: NgxIndexedDBService, public auth: ChangeDetectorJwt, public zmService: ZmService) {
    super(dbService, zmService);
    this.auth$ = this.auth.getDataChanges().pipe(filter(tt => tt.action === authActions.token)).subscribe(result => {
      this.token = result.payload.access_token;
      this.loadIndexedDbSettings();
    })
    this.datasource = {} as T;
  }

}