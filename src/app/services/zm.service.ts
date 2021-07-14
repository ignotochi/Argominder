import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILogin } from '../interfaces/Ilogin';
import { IMonitors } from '../interfaces/IMonitors';
import { IConf } from '../interfaces/Iconf';
import { CamEvents } from '../interfaces/camEvent';

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
  previewScale: string;
  previewMaxfps: string;
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
    this.previewScale = conf.previewScale;
    this.previewMaxfps = conf.previewMaxfps;
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

  getZmPreviewStream(cam: string, token: string) {
    const buildedUrl =
      this.protocol + this.streamUrl1 + '/zm/cgi-bin/nph-zms?scale=' +
      this.previewScale + '&mode=jpeg&maxfps=' +
      this.previewMaxfps + '&buffer=' +
      this.buffer + '&monitor=' +
      cam + '&token=' + token;
    return buildedUrl;
  }

  getEventPreview(eventId: string, token: string) {

    //https://yourserver/zm/cgi-bin/nph-zms?mode=jpeg&frame=1&replay=none&source=event&event=293820&connkey=77493&token=ew<deleted>
    const buildedUrl =
    this.protocol + this.streamUrl1 + '/zm/cgi-bin/nph-zms?sacle=15&mode=jpeg&frame=1&replay=none&source=event&event=' + eventId + '&token=' + token;
    return buildedUrl;
  }

  getCamEVents(token: string) {
    const buildedUrl = this.protocol + this.baseUrl + 
    'events/index/StartTime%20>=:' + 
    '2021-07-09'+
    '%20' + 
    '00:00:00' + 
    '/EndTime%20<=:' + 
    '2021-07-09' + 
    '%20' + 
    '23:59:00' + 
    '.json?' + 'token=' + token;

    return this.http.get<CamEvents>(buildedUrl);
  }

}