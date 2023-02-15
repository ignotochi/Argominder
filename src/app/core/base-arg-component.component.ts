import {  Component} from '@angular/core';
import { BaseIndexedDbConfigurationComponent } from './base-db.component';
import { CoreMainServices } from './core-main-services.service';

@Component({
  template: '',
})

export abstract class BaseCoreUtilsComponent<T> extends BaseIndexedDbConfigurationComponent {
  public token: string;
  public datasource: T;

  constructor(public mainServices: CoreMainServices) {
    super(mainServices.dbService, mainServices.zmService);
    this.loadIndexedDbSettings();
    this.datasource = {} as T;
  }

}