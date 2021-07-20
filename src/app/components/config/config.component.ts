import {
  AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild,
} from '@angular/core';
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
  public dateRange: { startDate: Date, endDate: Date } = {startDate: new Date(), endDate: new Date()};

  constructor(public sharedService: SharedService) {
  }

  ngOnInit() {
    this.setDateRange();
  }

  ngAfterViewInit() {

  }

  converDateFormat(date: Date) {
    let d = date, month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  setDateRange() {
    this.sharedService.dateEventsRange.startDate = this.converDateFormat(this.dateRange.startDate);
    this.sharedService.dateEventsRange.endDate = this.converDateFormat(this.dateRange.endDate);
  }

}