import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { streamingEventMode } from 'src/app/enums/enums';
import { IEventsFilter } from 'src/app/interfaces/IEventsFilter';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { SharedService } from 'src/app/services/shared.service';
import { zmService } from 'src/app/services/zm.service';


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
  public panelOpenState = false;
  public dateRange: IEventsFilter = {} as IEventsFilter;
  public showDateRangeSpinner: boolean = false;
  public startDateFilter: Date = new Date();
  public endtDateFIlter: Date = null;
  public camSelection = new FormControl();
  public camsList: { name: string, id: string }[] = [];
  public selectedCam: { name: string, id: string } = { name: null, id: null };
  public eventStreamMode: { name: string, value: streamingEventMode}[] = [];
  public selectedEventMode: streamingEventMode;


  constructor(public sharedService: SharedService, public zmService: zmService, private changeRef: ChangeDetectorRef) {
    this.setDefaultTime();
    
    const streamModes = Object.keys(streamingEventMode);
    streamModes.forEach(mode => {
      this.eventStreamMode.push({name: mode, value: streamingEventMode[mode]})
    })
    this.setDefaulEventStreamingConf(streamModes)
    this.selectedEventMode = this.sharedService.eventStreamingMode;


  }

  setDefaulEventStreamingConf(streamModes: string[]) {
    const defaultEventStreamMode = this.zmService.conf.defaultEventStreamingMode;
    const defaultModeToEnum = streamingEventMode[streamModes.find(mode => (mode === defaultEventStreamMode))];
    this.sharedService.eventStreamingMode = defaultModeToEnum;
  }

  ngOnInit() {
    this.setEventsFilters(true);
    this.sharedService.getCamRegistry().subscribe(result => {
      result.forEach(ele => {
        if (ele.Name && ele.Id) {
          this.camsList.push({ name: ele.Name, id: ele.Id });
        }
      });
    })
  }

  ngAfterViewInit() {
  }

  setDefaultTime() {
    const timeNow = new Date();
    const defaulHour = timeNow.getHours();
    const defaultMinute = timeNow.getMinutes();
    this.dateRange.startTime = (defaulHour - 1).toString() + ':' + defaultMinute.toString();
    this.dateRange.endTime = (defaulHour).toString() + ':' + defaultMinute.toString();
  }

  converDateFormat(date: Date) {
    let d = date, month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  setEventsFilters(isOnLoad: boolean) {
    this.endtDateFIlter = this.startDateFilter;
    this.sharedService.eventsFilterSearch.next({
      startDate: this.converDateFormat(this.startDateFilter),
      endDate: this.converDateFormat(this.endtDateFIlter),
      startTime: this.dateRange.startTime,
      endTime: this.dateRange.endTime,
      cam: this.selectedCam.id,
    });

    if (!isOnLoad) {
      this.showDateRangeSpinner = true;
      this.sharedService.getEventFiltersConf().subscribe(result => {
        setTimeout(() => {
          if (result) {
            this.showDateRangeSpinner = false; 
            this.changeRef.markForCheck();
          }
        }, 1500);
      })
    }
  }

  resetFilters() {
    this.setDefaultTime();
    const currentDate = new Date();
    this.sharedService.eventsFilterSearch.next({
      startDate: this.converDateFormat(currentDate),
      endDate: this.converDateFormat(currentDate),
      startTime: this.dateRange.startTime,
      endTime: this.dateRange.endTime,
      cam: null,
    });
    this.startDateFilter = currentDate;
    this.selectedCam = { name: null, id: null };
  }

  changeEventStreamingMode(mode: streamingEventMode) {
    this.sharedService.eventStreamingMode = mode;
  }

}