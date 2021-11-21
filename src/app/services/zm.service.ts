import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ILogin } from '../interfaces/ILogin';
import { IMonitors } from '../interfaces/IMonitors';
import { IConf } from '../interfaces/IConf';
import { ICamEvents } from '../interfaces/ICamEvent';
import { separators, streamingEventMode, zmUrl } from '../enums/enums';
import { UrlsBuilder } from '../core/build-urls';

@Injectable()

export class zmService {
  confUrl: string = 'assets/argominder.conf.json';
  streamLimt1: number = 6;
  streamLimt2: number = 12;
  streamLimt3: number = 18;
  streamLimt4: number = 24;
  conf: IConf;
  urlBuilder = new UrlsBuilder();

  constructor(private http: HttpClient) {

  }

  getConfigurationFile() {
    return this.http.get(this.confUrl);
  }

  configurationFileMapping(conf: IConf) {
    this.conf = conf;
  }

  zmLogin(username: string, password: string) {
    const url = this.urlBuilder.login(username, password, this.conf);
    return this.http.get<ILogin>(url);
  }

  getCamListInfo(token: string) {
    const url = this.urlBuilder.getCamListInfo(token, this.conf)
    return this.http.get<IMonitors>(url);
  }

  getLiveStream(camId: string, token: string, index: number) {
    var streamUrl: string;
    if (index <= this.streamLimt1) streamUrl = this.conf.streamUrl1;
    else if (index <= this.streamLimt2) streamUrl = this.conf.streamUrl2;
    else if (index <= this.streamLimt3) streamUrl = this.conf.streamUrl3;
    else if (index <= this.streamLimt4) streamUrl = this.conf.streamUrl4;
    return this.urlBuilder.liveStream(camId, token, streamUrl, this.conf);
  }

  getLiveStreamDetail(camId: string, token: string) {
    return this.urlBuilder.liveStreamDetail(camId, token, this.conf);
  }

  getEventStreamDetail(eventId: string, token: string, mode: string, frame: string) {
    return this.urlBuilder.eventStreamDetail(eventId, token, mode, this.conf, frame);
  }

  getEventsList(token: string, startDate: string, endDate: string, startTime: string, endTime: string, camId: string) {
    return this.http.get<ICamEvents>(this.urlBuilder.eventsList(token, startDate, endDate, startTime, endTime, camId, this.conf));
  }
}