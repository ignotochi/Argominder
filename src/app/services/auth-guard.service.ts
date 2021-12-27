import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ChangeDetectorJwt } from 'src/app/components/detectors/jwt.service';
import { ChangeDetectorConfigurations } from 'src/app/components/detectors/configurations.service';
import { ZmService } from 'src/app/services/zm.service';
import { Menu } from 'src/app/enums/enums';
import { Auth } from './auth.service';

@Injectable()

export class AuthGuardService implements CanActivate {
    constructor(public authConf: Auth, private router: Router, private auth: ChangeDetectorJwt, private configurations: ChangeDetectorConfigurations, private zmService: ZmService) {
    }
    
    canActivate(): boolean {
        if (!this.authConf.userIsLogged) {
            this.router.navigate([Menu.Home]);
            return false;
        }
        return true;
    }

}