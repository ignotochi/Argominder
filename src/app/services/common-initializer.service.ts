import { Injectable } from '@angular/core';
import { ChangeDetectorJwt } from 'src/app/components/detectors/jwt.service';
import { ZmService } from 'src/app/services/zm.service';
import { ICamRegistry } from 'src/app/interfaces/ICamRegistry';
import { Subscription } from 'rxjs';
import { ChangeDetectorConfigurations } from '../components/detectors/configurations.service';
import { authActions } from '../enums/enums';
import { filter } from 'rxjs/operators';

@Injectable()

export class CommoneInitializer {
    private camInfo$: Subscription;
    private auth$: Subscription;

    constructor(private zmService: ZmService, private configurations: ChangeDetectorConfigurations) {
    }

    getCamList(token: string) {
        this.camInfo$ = this.zmService.getCamListInfo(token).subscribe((result) => {

            result.monitors.forEach(result => {
                const registry: ICamRegistry = {
                    Name: result.Monitor.Name,
                    Id: result.Monitor.Id,
                    DayEvents: result.Monitor.DayEvents,
                    MonthEvents: result.Monitor.MonthEvents,
                    TotalEvents: result.Monitor.TotalEvents,
                    Function: result.Monitor.Function,
                    MaxFPS: result.Monitor.MaxFPS,
                    Path: result.Monitor.Path,
                    Type: result.Monitor.Type,
                    Width: result.Monitor.Width,
                    Height: result.Monitor.Height,
                }
                this.configurations.setCamDiapason(registry);
            });
        }, (err: Error) => {
            console.log(err);
        });
    }
}


