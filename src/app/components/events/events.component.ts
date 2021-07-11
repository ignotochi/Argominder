import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactoryResolver, ElementRef, Input, OnInit,
  ViewChild, ViewChildren
}
  from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { CamEvents } from 'src/app/interfaces/camEvent';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { ConfigService } from '../../services/zm.service';


@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class EventsComponent implements OnInit, AfterViewInit {
  @Input()
  public set localToken(input: string) { this._localToken = input; }
  public get localToken(): string { return this._localToken; }
  private _localToken: string = null;
  displayedColumns: string[] = ['EventID', 'Cause', 'MonitorId', 'StartTime', 'EndTime', 'Length', 'Frames', 'MaxScore'];


  public datasource: CamEvents = (<CamEvents>{ events: [], pagination: {}}) ;

  constructor(private pageService: ConfigService) {
  }

  ngOnInit() {
    this.getEvents();
  }

  ngAfterViewInit() {
  }


  getEvents() {
    this.pageService.getCamEVents(this.localToken).subscribe(result => {
      this.datasource = result;
    }); 
  }



}