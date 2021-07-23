import { ObserversModule } from '@angular/cdk/observers';
import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Observable } from 'rxjs';
import { ICamRegistry } from '../interfaces/ICamRegistry';
import { IDateTimeFilter } from '../interfaces/IDateTimeFilter';

@Injectable()

export class SharedService {

  streamProperties: { streamUrl: string, camId: string} = {streamUrl: null, camId: null};
  camsRegistry: ICamRegistry[] = [];
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

  getPreviewInfo(camId: string, isDetail: boolean) {
    const camName = this.camsRegistry.find(cam => cam.Id === camId).Name;
    const camMaxFps = this.camsRegistry.find(cam => cam.Id === camId).MaxFPS;
    const camWidth = this.camsRegistry.find(cam => cam.Id === camId).Width;
    const camHeigth = this.camsRegistry.find(cam => cam.Id === camId).Height;
    const dayEvents = this.camsRegistry.find(cam => cam.Id === camId).DayEvents;
    const functionMode = this.camsRegistry.find(cam => cam.Id === camId).Function;
    if (!isDetail) return camName + ' | ' + camMaxFps + ' fps' + ' | ' + camWidth + ' px' + ' | ' + camHeigth + ' px';
    if (isDetail) return 'Name: ' + camName + ' | ' + 'Day Events: ' + dayEvents + ' | ' + ' Mode: ' + functionMode;
  }

}