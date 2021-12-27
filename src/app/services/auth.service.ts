import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorJwt } from 'src/app/components/detectors/jwt.service';
import { ChangeDetectorConfigurations } from 'src/app/components/detectors/configurations.service';
import { ZmService } from 'src/app/services/zm.service';
import { CommoneInitializer } from 'src/app/services/common-initializer.service';
import { Menu } from 'src/app/enums/enums';
import { ILogin } from 'src/app/interfaces/ILogin';
import { IConf } from '../interfaces/Iconf';
import { switchMap } from 'rxjs/operators';

@Injectable()

export class Auth {
    public errorLogin: string = "";
    public zmUsername: string = "";
    public zmPassword: string = "";
    public localToken: string = "";
    public userIsLogged: boolean = false;
    public login: ILogin = (<ILogin>{ login: {} });

    constructor(private router: Router, private auth: ChangeDetectorJwt, private configurations: ChangeDetectorConfigurations, private zmService: ZmService, 
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
        this.auth.compleDataChanges();
        this.configurations.compleDataChanges()
        this.router.navigate([Menu.Home]);
        this.auth = null;
        this.zmService = null;
        this.configurations = null;
        this.errorLogin = '';
    }

    public logInZm() {
        return this.zmService.getConfigurationFile().pipe(
            switchMap((conf: IConf) => {
                this.zmService.configurationFileMapping(conf);
                return this.zmService.zmLogin(this.zmUsername, this.zmPassword);
            })
        ).subscribe((login: ILogin) => {
            this.login = login;
            this.userIsLogged = this.login.access_token.length > 0 ? true : false;
            this.saveSession();
            this.localToken = localStorage.getItem("accessToken");
            this.auth.setToken(this.localToken);
            this.afterLogin();
        },
            (err: Error) => {
                this.errorLogin = err.message;
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
    }


}