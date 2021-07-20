import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILogin } from '../interfaces/ILogin';
import { IMonitors } from '../interfaces/IMonitors';
import { IConf } from '../interfaces/IConf';
import { ICamEvents } from '../interfaces/ICamEvent';

@Injectable()

export class zmService {
  confUrl: string = 'assets/argominder.conf.json';
  streamLimt1: number = 6;
  streamLimt2: number = 12;
  streamLimt3: number = 18;
  streamLimt4: number = 24;
  conf: IConf;

  constructor(private http: HttpClient) {
  }

  getConfigurationFile() {
    return this.http.get(this.confUrl);
  }

  configurationFileMapping(conf: IConf) {
    this.conf = conf;
  }

  zmLogin(username: string, password: string) {
    const buildedUrl = this.conf.protocol + this.conf.baseUrl + 'host/login.json?' + 'user=' + username + '&' + 'pass=' + password;
    return this.http.get<ILogin>(buildedUrl);
  }

  getCamListInfo(token: string) {
    const buildedUrl = this.conf.protocol + this.conf.baseUrl + 'monitors.json?' + 'token=' + token;
    return this.http.get<IMonitors>(buildedUrl);
  }

  getLiveStream(cam: string, token: string, index: number) {
    let streamUrl: string;
    if (index <= this.streamLimt1) { streamUrl = this.conf.streamUrl1; }
    else if (index <= this.streamLimt2) { streamUrl = this.conf.streamUrl2; }
    else if (index <= this.streamLimt3) { streamUrl = this.conf.streamUrl3; }
    else if (index <= this.streamLimt4) { streamUrl = this.conf.streamUrl4; }
    const buildedUrl =
      this.conf.protocol + streamUrl + '/zm/cgi-bin/nph-zms?scale=' +
      this.conf.scale + '&mode=jpeg&maxfps=' +
      this.conf.maxfps + '&buffer=' +
      this.conf.buffer + '&monitor=' +
      cam + '&token=' + token;
    return buildedUrl;
  }

  getCamDetailStreamPreview(cam: string, token: string) {
    const buildedUrl =
      this.conf.protocol + this.conf.streamUrl1 + '/zm/cgi-bin/nph-zms?scale=' +
      this.conf.previewScale + '&mode=jpeg&maxfps=' +
      this.conf.previewMaxfps + '&buffer=' +
      this.conf.buffer + '&monitor=' +
      cam + '&token=' + token;
    return buildedUrl;
  }

  getEventPreview(eventId: string, token: string) {
    const buildedUrl = this.conf.protocol + this.conf.streamUrl1 + '/zm/cgi-bin/nph-zms?' +
      'sacle=15' +
      '&mode=jpeg' +
      '&frame=1' +
      '&replay=none&source=event&event=' +
      eventId + '&token=' + token;
    return buildedUrl;
  }

  getEventsList(token: string, startDate: string, endDate: string) {
    const buildedUrl = this.conf.protocol + this.conf.baseUrl + 'events/index/StartTime%20>=:' +
      startDate + '%20' +
      '00:00:00' + '/EndTime%20<=:' +
      endDate + '%20' +
      '23:59:00' + '.json?' + 'token=' + token;
    return this.http.get<ICamEvents>(buildedUrl);
  }


}