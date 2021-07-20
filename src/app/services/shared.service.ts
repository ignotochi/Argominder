import { ObserversModule } from '@angular/cdk/observers';
import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Observable } from 'rxjs';
import { ICamRegistry } from '../interfaces/ICamRegistry';

@Injectable()

export class SharedService {

  streamProperties: { streamUrl: string, camId: string} = {streamUrl: null, camId: null};
  previewIsActive: boolean = false;
  previewStatus = new BehaviorSubject(this.previewIsActive);
  camsRegistry: ICamRegistry[] = [];
  dateEventsRange: {startDate: string, endDate: string} = {startDate: null, endDate: null};

  constructor() {
  }

  getPreviewStatus(): Observable<boolean> {
    return this.previewStatus;
  }

  getPreviewInfo(camId: string, isDetail: boolean) {
    const camName = this.camsRegistry.find(cam => cam.Id === camId).Name;
    const camMaxFps = this.camsRegistry.find(cam => cam.Id === camId).MaxFPS;
    const camWidth = this.camsRegistry.find(cam => cam.Id === camId).Width;
    const camHeigth = this.camsRegistry.find(cam => cam.Id === camId).Height;
    const dayEvents = this.camsRegistry.find(cam => cam.Id === camId).DayEvents;
    const functionMode = this.camsRegistry.find(cam => cam.Id === camId).Function;
    const typeMode = this.camsRegistry.find(cam => cam.Id === camId).Type;
    if (!isDetail) return camName + ' | ' + camMaxFps + ' fps' + ' | ' + camWidth + ' px' + ' | ' + camHeigth + ' px';
    if (isDetail) return 'Name: ' + camName + ' | ' + 'Day Events: ' + dayEvents + ' | ' + ' Mode: ' + functionMode;
  }

}