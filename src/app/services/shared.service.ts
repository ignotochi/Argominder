import { ObserversModule } from '@angular/cdk/observers';
import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Observable } from 'rxjs';

@Injectable()

export class SharedService {

  streamUrl: string;
  previewIsActive: boolean = false;
  previewStatus = new BehaviorSubject(this.previewIsActive);

  constructor() {
  }

  getPreviewStatus(): Observable<boolean> {
    return this.previewStatus;
  }

}