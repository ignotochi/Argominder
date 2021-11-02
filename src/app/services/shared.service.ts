import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { streamingConf, streamingEventMode } from '../enums/enums';
import { previewType } from '../enums/preview-enum';
import { ICamRegistry } from '../interfaces/ICamRegistry';
import { IConfigStreaming } from '../interfaces/IConfStreaming';
import { IEventsFilter } from '../interfaces/IEventsFilter';
import { IStreamProperties } from '../interfaces/IStreamProperties';

@Injectable()

export class SharedService {

  streamProperties: IStreamProperties = {} as IStreamProperties;
  dateEventsRange: IEventsFilter = {} as IEventsFilter;
  camSpecializedInfo: ICamRegistry[] = [{}];
  eventStreamingMode: streamingEventMode;
  previewIsActive: boolean = false;
  previewStatus = new BehaviorSubject(this.previewIsActive);
  camDiapason = new BehaviorSubject(this.camSpecializedInfo);
  eventsFilterSearch = new BehaviorSubject(this.dateEventsRange);

  constructor() {
  }

  getCamRegistry(): Observable<ICamRegistry[]> {
    return this.camDiapason;
  }

  getPreviewStatus(): Observable<boolean> {
    return this.previewStatus;
  }

  getEventFiltersConf(): Observable<IEventsFilter> {
    return this.eventsFilterSearch;
  }

  setStreamProperties(previewType: previewType, streamUrl: string, camId: string, streamingMode: streamingEventMode) {
    this.streamProperties.previewType = previewType;
    this.streamProperties.streamUrl = streamUrl;
    this.streamProperties.camId = camId;
    this.streamProperties.streamingMode = streamingMode;
  }

  flushStreamProperties() {
    this.streamProperties = {} as IStreamProperties;
  }

  getPreviewInfo(camId: string, detail: previewType) {
    const camName = this.camSpecializedInfo.find(cam => cam.Id === camId).Name;
    const camMaxFps = this.camSpecializedInfo.find(cam => cam.Id === camId).MaxFPS;
    const camWidth = this.camSpecializedInfo.find(cam => cam.Id === camId).Width;
    const camHeigth = this.camSpecializedInfo.find(cam => cam.Id === camId).Height;
    const dayEvents = this.camSpecializedInfo.find(cam => cam.Id === camId).DayEvents;
    const functionMode = this.camSpecializedInfo.find(cam => cam.Id === camId).Function;
    const starTime = this.camSpecializedInfo.find(cam => cam.Id === camId).StartTime;
    const score = this.camSpecializedInfo.find(cam => cam.Id === camId).MaxScore;
    const length = this.camSpecializedInfo.find(cam => cam.Id === camId).Length;

    if (detail === previewType.streaming) return camName + ' | ' + camMaxFps + ' fps' + ' | ' + camWidth + ' px' + ' | ' + camHeigth + ' px';
    if (detail === previewType.streamingDetail) return 'Name: ' + camName + ' | ' + 'Day Events: ' + dayEvents + ' | ' + ' Mode: ' + functionMode;
    if (detail === previewType.eventDetail) return 'Name: ' + camName + ' | ' + 'Start time: ' + starTime + ' | ' + ' Score: ' + score + ' | ' + ' Length: ' + length;
  }


  applyNewStreamingConf(confChanges: BehaviorSubject<IConfigStreaming[]>,value: number, type: string) {
    confChanges.next([{ value: value, type: streamingConf[type] }]);
  }

  applyNewEventsFilters(startDate: string, endDate: string, startTime: string, endTime: string, cam: string) {
    this.eventsFilterSearch.next({startDate, endDate, startTime, endTime, cam});
  }

  resetEventsFilters(startDate: string, endDate: string, startTime: string, endTime: string, cam: string) {
    this.eventsFilterSearch.next({startDate, endDate, startTime, endTime, cam});
  }

  relaodLiveStreaming() {
    this.previewStatus.next(true);
    this.previewStatus.next(false);
  }

  setPreviewStatus(status: boolean) {
    this.previewStatus.next(status);
  }

  setDiapason(diapason: ICamRegistry){
    this.camDiapason.next([diapason]);
  }
}