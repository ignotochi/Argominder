import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit
} from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { IConf } from './interfaces/Iconf';
import { ILogin } from './interfaces/Ilogin';
import { ConfigService } from './services/zm.service';

@Component({
  selector: 'argominder',
  templateUrl: './argominder.component.html',
  styleUrls: ['./argominder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArgoMinderComponent implements OnInit, AfterViewInit {
  login: ILogin = (<ILogin>{ login: {} });
  userIsLogged: boolean = false;
  errorLogin: string = '';
  zmUsername: string = '';
  zmPassword: string = '';
  localToken: string = '';
  selectedTab: number;
  loadStream: boolean;

  constructor(private pageService: ConfigService, private changeRef: ChangeDetectorRef) {
    if(this.retrieveSession() === true) {
      this.selectedTab = 1;
      this.userIsLogged = true;
      this.logInZm(true);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  logInZm(isRetrieved: boolean) {
    return this.pageService.getConfigurationFile().pipe(
      switchMap((conf: IConf) => {
        this.pageService.configurationFileMapping(conf);
        return this.pageService.zmLogin(this.zmUsername, this.zmPassword);
      })
    ).subscribe((login: ILogin) => {
      this.login = login;
      if (!isRetrieved) {
        this.userIsLogged = this.login.access_token.length > 0 ? true : false;
        this.saveSession();
        this.localToken = localStorage.getItem("accessToken");
        this.selectedTab = 1;
      }
      this.loadStream = login.access_token.length > 0 ? true : false;
      this.changeRef.markForCheck();
    }, (err: Error) => {
      this.errorLogin = err.message;
    });
  }

  retrieveSession() {
    this.localToken = localStorage.getItem("accessToken") ? this.localToken = localStorage.getItem("accessToken") : this.localToken;
    this.zmUsername = localStorage.getItem("username") ? this.zmUsername = localStorage.getItem("username") : this.zmUsername;
    this.zmPassword = localStorage.getItem("password") ? this.zmPassword = localStorage.getItem("password") : this.zmPassword;
    if (this.localToken.length > 0 && this.zmUsername.length > 0 && this.zmPassword.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  saveSession() {
    localStorage.setItem("accessToken", this.login.access_token);
    localStorage.setItem("username", this.zmUsername);
    localStorage.setItem("password", this.zmPassword);
  }

  destroySession() {
    localStorage.setItem("accessToken", '');
    localStorage.setItem("username", '');
    localStorage.setItem("password", '');
    this.errorLogin = '';
  }

  logOutZm() {
    this.userIsLogged = false;
    this.destroySession();
    location.reload();
  }

}