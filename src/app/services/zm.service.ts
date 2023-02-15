import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILogin } from '../interfaces/ILogin';
import { IMonitors } from '../interfaces/IMonitors';
import { IConf } from '../interfaces/IConf';
import { ICamEvents } from '../interfaces/ICamEvent';
import { UrlsBuilder } from '../core/build-urls';
import { previewType } from '../enums/preview-enum';
import { ICamRegistry } from '../interfaces/ICamRegistry';

@Injectable()

export class ZmService {
  private confUrl: string = 'assets/argominder.conf.json';
  private streamLimt1: number = 6;
  private streamLimt2: number = 12;
  private streamLimt3: number = 18;
  private streamLimt4: number = 24;
  public conf: IConf;
  public urlsBuilder = new UrlsBuilder();

  constructor(private http: HttpClient) {
  }

  public getPreviewInfo(camDiapason: ICamRegistry[], camId: string, detail: previewType) {
    const selectedCam = camDiapason.find(cam => cam.Id === camId);
    const camName = selectedCam.Name;
    const camMaxFps = selectedCam.MaxFPS;
    const camWidth = selectedCam.Width;
    const camHeigth = selectedCam.Height;
    const dayEvents = selectedCam.DayEvents;
    const functionMode = selectedCam.Function;
    const starTime = selectedCam.StartTime;
    const score = selectedCam.MaxScore;
    const length = selectedCam.Length;

    if (detail === previewType.streaming) return camName + ' | ' + camMaxFps + ' fps' + ' | ' + camWidth + ' px' + ' | ' + camHeigth + ' px';
    if (detail === previewType.streamingDetail) return 'Name: ' + camName + ' | ' + 'Day Events: ' + dayEvents + ' | ' + ' Mode: ' + functionMode;
    if (detail === previewType.eventDetail) return 'Name: ' + camName + ' | ' + 'Start time: ' + starTime + ' | ' + ' Score: ' + score + ' | ' + ' Length: ' + length;
  }

  getConfigurationFile() {
    return this.http.get(this.confUrl);
  }

  configurationFileMapping(conf: IConf) {
    this.conf = conf;
  }

  zmLogin(username: string, password: string) {
    const url = this.urlsBuilder.login(username, password, this.conf);
    return this.http.get<ILogin>(url);
  }

  getCamListInfo() {
    const url = this.urlsBuilder.getCamListInfo(this.conf)
    return this.http.get<IMonitors>(url);
  }

  getLiveStream(camId: string, index: number, streamScale: string, streamFps: string) {
    var streamUrl: string;
    if (index <= this.streamLimt1) streamUrl = this.conf.streamUrl1;
    else if (index <= this.streamLimt2) streamUrl = this.conf.streamUrl2;
    else if (index <= this.streamLimt3) streamUrl = this.conf.streamUrl3;
    else if (index <= this.streamLimt4) streamUrl = this.conf.streamUrl4;
    return this.urlsBuilder.liveStream(camId, streamUrl, this.conf, streamScale, streamFps);
  }

  getLiveStreamDetail(camId: string, detailStreamingScale: string, detailStreamingMaxfps: string) {
    return this.urlsBuilder.liveStreamDetail(camId, this.conf, detailStreamingScale, detailStreamingMaxfps);
  }

  getEventStreamDetail(eventId: string, mode: string, frame: string, detailStreamingScale: string) {
    return this.urlsBuilder.eventStreamDetail(eventId, mode, this.conf, frame, detailStreamingScale);
  }

  getEventsList(startDate: string, endDate: string, startTime: string, endTime: string, camId: string) {
    return this.http.get<ICamEvents>(this.urlsBuilder.eventsList(startDate, endDate, startTime, endTime, camId, this.conf));
  }
}