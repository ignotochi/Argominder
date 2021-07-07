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
    selector: 'config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
  })
  export class ConfigComponent implements OnInit, AfterViewInit {
    @Input()
    public set localToken(input: string) { this._localToken = input; }
    public get localToken(): string { return this._localToken; }
    private _localToken: string = null;
    public datasource: IMonitors = (<IMonitors>{ monitors: [] });
    panelOpenState = false;
  
    constructor() {
    }
  
    ngOnInit() {
    }
  
    ngAfterViewInit() {

    }
  

  
  }