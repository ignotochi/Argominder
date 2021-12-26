import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorJwt } from 'src/app/components/detectors/jwt.service';
import { ChangeDetectorConfigurations } from 'src/app/components/detectors/configurations.service';
import { zmService } from 'src/app/services/zm.service';
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

    constructor(private router: Router, private auth: ChangeDetectorJwt, private configurations: ChangeDetectorConfigurations, private zmService: zmService) {
        this.setSession();
    }

    setSession() {
        this.localToken = localStorage.getItem("accessToken") ? this.localToken = localStorage.getItem("accessToken") : this.localToken;
    }

    isValidToken() {
        if (this.localToken.length > 0 && this.zmUsername.length > 0 && this.zmPassword.length > 0) return true;
        else return false;
    }

    saveSession() {
        localStorage.setItem("accessToken", this.login.access_token);
    }

    destroySession() {
        localStorage.setItem("accessToken", '');
        this.auth.compleDataChanges();
        this.configurations.compleDataChanges()
        this.router.navigate([Menu.Home]);
        this.auth = null;
        this.zmService = null;
        this.configurations = null;
        this.errorLogin = '';
    }

    logInZm() {
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
        },
            (err: Error) => {
                this.errorLogin = err.message;
            });
    }

    logOutZm() {
        this.userIsLogged = false;
        this.destroySession();
        this.router.navigate([Menu.Home]);
        location.reload();
    }


}