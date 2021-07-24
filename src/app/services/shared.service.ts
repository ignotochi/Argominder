import { ObserversModule } from '@angular/cdk/observers';
import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Observable } from 'rxjs';
import { previewType } from '../enums/preview-enum';
import { ICamRegistry } from '../interfaces/ICamRegistry';
import { IDateTimeFilter } from '../interfaces/IDateTimeFilter';

@Injectable()

export class SharedService {

  streamProperties: { streamUrl: string, camId: string, previewType: previewType} = {streamUrl: null, camId: null, previewType: null};
  camsRegistry: ICamRegistry[] = [{StartTime: null, Length: null, MaxScore: null}];
  previewIsActive: boolean = false;
  previewStatus = new BehaviorSubject(this.previewIsActive);
  dateEventsRange: IDateTimeFilter = {startDate: null, endDate: null, startTime: null, endTime: null};
  eventsFilterSearch = new BehaviorSubject(this.dateEventsRange);

  constructor() {
  }

  getPreviewStatus(): Observable<boolean> {
    return this.previewStatus;
  }

  getEventFiltersConf(): Observable<IDateTimeFilter> {
    return this.eventsFilterSearch;
  }

  getPreviewInfo(camId: string, detail: previewType) {
    const camName = this.camsRegistry.find(cam => cam.Id === camId).Name;
    const camMaxFps = this.camsRegistry.find(cam => cam.Id === camId).MaxFPS;
    const camWidth = this.camsRegistry.find(cam => cam.Id === camId).Width;
    const camHeigth = this.camsRegistry.find(cam => cam.Id === camId).Height;
    const dayEvents = this.camsRegistry.find(cam => cam.Id === camId).DayEvents;
    const functionMode = this.camsRegistry.find(cam => cam.Id === camId).Function;
    const starTime = this.camsRegistry.find(cam => cam.Id === camId).StartTime;
    const score = this.camsRegistry.find(cam => cam.Id === camId).MaxScore;
    const length = this.camsRegistry.find(cam => cam.Id === camId).Length;

    if (detail === previewType.streaming) return camName + ' | ' + camMaxFps + ' fps' + ' | ' + camWidth + ' px' + ' | ' + camHeigth + ' px';
    if (detail === previewType.streamingDetail) return 'Name: ' + camName + ' | ' + 'Day Events: ' + dayEvents + ' | ' + ' Mode: ' + functionMode;
    if (detail === previewType.eventDetail) return 'Name: ' + camName + ' | ' + 'Start time: ' + starTime + ' | ' + ' Score: ' + score + ' | ' + ' Length: ' + length;
  }

}