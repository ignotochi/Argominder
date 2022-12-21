import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorJwt } from 'src/app/core/detectors/jwt.service';
import { ChangeDetectorConfigurations } from 'src/app/core/detectors/configurations.service';
import { ZmService } from 'src/app/services/zm.service';
import { CommoneInitializer } from 'src/app/services/common-initializer.service';
import { Menu } from 'src/app/enums/enums';
import { ILogin } from 'src/app/interfaces/ILogin';
import { IConf } from '../interfaces/Iconf';
import { switchMap } from 'rxjs/operators';
import { UrlsBuilder } from '../core/build-urls';
import { HttpErrorResponse } from '@angular/common/http';
import { isNullOrEmptyString } from '../utils/helper';

@Injectable()

export class Auth {
    public errorLogin: string = "";
    public zmUsername: string = "";
    public zmPassword: string = "";
    public localToken: string = "";
    public userIsLogged: boolean;
    public login: ILogin = (<ILogin>{ login: {} });
    public urlsBuilder: UrlsBuilder;

    constructor(private router: Router, private jwt: ChangeDetectorJwt, private configurations: ChangeDetectorConfigurations, private zmService: ZmService,
        private commoneInitializer: CommoneInitializer) {
        this.setSession();
    }

    private setSession() {
        this.localToken = localStorage.getItem("accessToken") ? this.localToken = localStorage.getItem("accessToken") : this.localToken;
    }

    public isValidToken() {
        if (this.localToken.length > 0 && this.zmUsername.length > 0 && this.zmPassword.length > 0) return true;
        else return false;
    }

    private saveSession() {
        localStorage.setItem("accessToken", this.login.access_token);
    }

    public destroySession() {
        localStorage.setItem("accessToken", '');
        this.jwt.compleDataChanges();
        this.configurations.compleDataChanges()
        this.router.navigate([Menu.Home]);
        this.jwt = null;
        this.zmService = null;
        this.commoneInitializer = null;
        this.configurations = null;
        this.errorLogin = '';
    }

    public logInZm() {
       
        var result: boolean = false;
       
        return this.zmService.getConfigurationFile().pipe(
            switchMap((conf: IConf) => {
                this.zmService.configurationFileMapping(conf);
                return this.zmService.zmLogin(this.zmUsername, this.zmPassword);
            })
        ).subscribe((login: ILogin) => {
            this.login = login;
            this.userIsLogged = !isNullOrEmptyString(this.login.access_token) ? true : false;
            this.saveSession();
            this.localToken = localStorage.getItem("accessToken");
            this.zmService.urlsBuilder.token = this.localToken;
            this.jwt.setToken(this.localToken);
            this.afterLogin();
        },
            (err: HttpErrorResponse) => {
                this.userIsLogged = false;
                this.errorLogin = err.statusText;
                this.jwt.setToken(null);
            });
    }

    public logOutZm() {
        this.userIsLogged = false;
        this.destroySession();
        this.router.navigate([Menu.Home]);
        location.reload();
    }

    private afterLogin() {
        this.commoneInitializer.getCamList(this.localToken);
        this.commoneInitializer.setDefaulEventStreamingConf();
        this.commoneInitializer.setDefaultEventsFilters();
    }
}