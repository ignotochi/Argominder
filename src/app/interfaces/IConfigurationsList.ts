import { ICamRegistry } from "./ICamRegistry";
import { IConfigStreaming } from "./IConfStreaming";
import { IEventsFilter } from "./IEventsFilter";
import { IStreamProperties } from "./IStreamProperties";

export interface IConfigurationsList {
    previewStatus: boolean;
    camDiapason: ICamRegistry[];
    eventsFilter: IEventsFilter;
    streamingConfChanges: IConfigStreaming[];
    streamingProperties: IStreamProperties;
  }