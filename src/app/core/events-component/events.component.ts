import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
    Component, ComponentFactoryResolver, ElementRef, Input, OnInit,
    ViewChild, ViewChildren
  } from '@angular/core';
  import { StreamStatus } from 'src/app/enums/stream-enum';
  import { IMonitor } from 'src/app/interfaces/IMonitor';
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
    public datasource: IMonitors = (<IMonitors>{ monitors: [] });
  
    constructor() {
    }
  
    ngOnInit() {
    }
  
    ngAfterViewInit() {

    }
  

  
  }