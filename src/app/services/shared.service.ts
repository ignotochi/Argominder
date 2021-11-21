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
  private previewStatus = new BehaviorSubject(false);
  private camDiapason = new BehaviorSubject(null as ICamRegistry[]);
  private eventsFilterSearch = new BehaviorSubject({} as IEventsFilter);
  private streamingConfChanges = new BehaviorSubject(null as IConfigStreaming[]);
  private streamingProperties = new BehaviorSubject({} as IStreamProperties);

  constructor() {
  }

  public getPreviewInfo(camId: string, detail: previewType) {
    const selectedCam = this.camDiapason.getValue().find(cam => cam.Id === camId);
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

  public updateStreamingProperties(properties: IStreamProperties): void {
    this.streamingProperties.next(properties);

  }

  public getStreamingProperties(): Observable<IStreamProperties> {
    return this.streamingProperties;
  }

  public completeStreamingProperties(): void {
    this.streamingProperties.complete();
  }

  public updateStreamingConf(value: number, type: string): void {
    this.streamingConfChanges.next([{ value: value, type: streamingConf[type] }]);
  }

  public getStreamingConf(): Observable<IConfigStreaming[]> {
    return this.streamingConfChanges;
  }

  public completeStreamingConf(): void {
    this.streamingConfChanges.complete();
  }

  public updateEventsFilters(filters: IEventsFilter): void {
    this.eventsFilterSearch.next(filters);
  }

  public getEventFiltersConf(): Observable<IEventsFilter> {
    return this.eventsFilterSearch;
  }

  public completeEventsFiltersSubject(): void {
    this.eventsFilterSearch.complete();
  }

  public relaodLiveStreaming(): void {
    this.previewStatus.next(true); 
    this.previewStatus.next(false);
  }

  public updatePreviewStatus(status: boolean): void {
    this.previewStatus.next(status);
  }

  public getPreviewStatus(): Observable<boolean> {
    return this.previewStatus;
  }

  public completeLiveStreamingSubject(): void {
    this.previewStatus.complete();
  }

  public updateDiapason(diapason: ICamRegistry): void {
    this.camDiapason.next([diapason]);
  }

  public getCamRegistry(): Observable<ICamRegistry[]> {
    return this.camDiapason;
  }

  public completeDiapasonSubject(): void {
    this.camDiapason.complete();
  }
  
}