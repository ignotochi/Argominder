import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ChangeDetectorConfigurations } from './detectors/configurations.service';
import { ChangeDetectorJwt } from './detectors/jwt.service';
import { CommoneInitializer } from '../services/common-initializer.service';
import { ZmService } from '../services/zm.service';


@Injectable()

export class CoreMainServices  {
    constructor(public zmService: ZmService, public dbService: NgxIndexedDBService, public jwt: ChangeDetectorJwt, public configurations: ChangeDetectorConfigurations,
        public commonInitializer: CommoneInitializer) {
    }
}