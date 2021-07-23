import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild,
} from '@angular/core';
import { IDateTimeFilter } from 'src/app/interfaces/IDateTimeFilter';
import { IMonitors } from 'src/app/interfaces/IMonitors';
import { SharedService } from 'src/app/services/shared.service';


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
  public dateRange: IDateTimeFilter = { startDate: null, endDate: null, startTime: null, endTime: null };
  public showDateRangeSpinner: boolean = false;
  public startDateFilter: Date = new Date();
  public endtDateFIlter: Date = null;

  constructor(public sharedService: SharedService, private changeRef: ChangeDetectorRef) {
    this.setDefaultTime();
  }

  ngOnInit() {
    this.setDateRange(true);
  }

  ngAfterViewInit() {
  }

  setDefaultTime () {
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

  setDateRange(isOnLoad: boolean) {
    this.endtDateFIlter = this.startDateFilter;
    this.sharedService.eventsFilterSearch.next(
      { 
        startDate: this.converDateFormat(this.startDateFilter), 
        endDate: this.converDateFormat(this.endtDateFIlter),
        startTime: this.dateRange.startTime,
        endTime: this.dateRange.endTime, 
      });
    if(!isOnLoad) {
      this.showDateRangeSpinner = true;
      this.sharedService.getEventFiltersConf().subscribe(result => {
        setTimeout(() => {
          if (result) { this.showDateRangeSpinner = false; this.changeRef.markForCheck();
          }
        }, 1500);
      })
    }
  }

}