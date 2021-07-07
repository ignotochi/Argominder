import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILogin } from '../interfaces/Ilogin';
import { IMonitors } from '../interfaces/IMonitors';
import { IConf } from '../interfaces/Iconf';

@Injectable()

export class ConfigService {
  confUrl: string = 'assets/argominder.conf.json';
  protocol: string;
  baseUrl: string;
  streamUrl1: string;
  streamUrl2: string;
  streamUrl3: string;
  streamUrl4: string;
  streamLimt1: number = 6;
  streamLimt2: number = 12;
  streamLimt3: number = 18;
  streamLimt4: number = 24;
  scale: string;
  maxfps: string;
  buffer: string;
  conf: IConf;

  constructor(private http: HttpClient) {
  }

  getConfigurationFile() {
    return this.http.get(this.confUrl);
  }

  configurationFileMapping(conf: IConf) {
    this.protocol = conf.protocol;
    this.baseUrl = conf.baseUrl;
    this.scale = conf.scale;
    this.maxfps = conf.maxfps;
    this.buffer = conf.buffer;
    this.streamUrl1 = conf.streamUrl1;
    this.streamUrl2 = conf.streamUrl2;
    this.streamUrl3 = conf.streamUrl3;
    this.streamUrl4 = conf.streamUrl4;
  }

  zmLogin(username: string, password: string) {
    const buildedUrl = this.protocol + this.baseUrl + 'host/login.json?' + 'user=' + username + '&' + 'pass=' + password;
    return this.http.get<ILogin>(buildedUrl);
  }

  zmCamsList(token: string) {
    const buildedUrl = this.protocol + this.baseUrl + 'monitors.json?' + 'token=' + token;
    return this.http.get<IMonitors>(buildedUrl);
  }

  getZmStream(cam: string, token: string, index: number) {
    let streamUrl: string;
    if (index <= this.streamLimt1) { streamUrl = this.streamUrl1; }
    else if (index <= this.streamLimt2) { streamUrl = this.streamUrl2; }
    else if (index <= this.streamLimt3) { streamUrl = this.streamUrl3; }
    else if (index <= this.streamLimt4) { streamUrl = this.streamUrl4; }
    const buildedUrl =
      this.protocol + streamUrl + '/zm/cgi-bin/nph-zms?scale=' +
      this.scale + '&mode=jpeg&maxfps=' +
      this.maxfps + '&buffer=' +
      this.buffer + '&monitor=' +
      cam + '&token=' + token;
    return buildedUrl;
  }

}