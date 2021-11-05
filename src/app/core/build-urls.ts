import { separators, streamingEventMode, zmUrl } from "../enums/enums";
import { IConf } from "../interfaces/IConf";

export class UrlsBuilder {
  constructor() { }

  liveStream(camId: string, token: string, streamUrl: string, conf: IConf): string {
    const buildedUrl = conf.protocol + streamUrl + zmUrl.cgiBinPath + separators.question + zmUrl.scale + separators.equal + conf.liveStreamingScale + separators.and +
      zmUrl.mode + separators.equal + streamingEventMode.jpeg + separators.and + zmUrl.maxfps + separators.equal + conf.liveStreamingMaxFps + separators.and +
      zmUrl.buffer + separators.equal + conf.buffer + separators.and + zmUrl.monitor + separators.equal + camId + separators.and + zmUrl.token + separators.equal + token;
    return buildedUrl;
  }

  liveStreamDetail(camId: string, token: string, conf: IConf): string {
    const buildedUrl = conf.protocol + conf.streamUrl1 + zmUrl.cgiBinPath + separators.question + zmUrl.scale + separators.equal + conf.detailStreamingScale + separators.and +
      zmUrl.mode + separators.equal + streamingEventMode.jpeg + separators.and + zmUrl.maxfps + conf.detailStreamingMaxfps + separators.and +
      zmUrl.buffer + conf.buffer + separators.and + zmUrl.monitor + separators.equal + camId + separators.and + zmUrl.token + separators.equal + token;
    return buildedUrl;
  }

  eventStreamDetail(eventId: string, token: string, mode: string, conf: IConf, frame: string): string {
    if (mode === streamingEventMode.jpeg) {
      const buildedUrl = conf.protocol + conf.streamUrl1 + zmUrl.cgiBinPath + separators.question + zmUrl.scale + separators.equal + conf.liveStreamingScale +
        separators.and + zmUrl.mode + separators.equal + streamingEventMode.jpeg + separators.and + zmUrl.frame + separators.equal + frame + separators.and + zmUrl.event +
        separators.equal + eventId + separators.and + zmUrl.token + separators.equal + token;
      return buildedUrl;
    }
    else if (mode === streamingEventMode.video) {
      const buildedUrl = conf.protocol + conf.streamUrl1 + zmUrl.index + separators.question +
        zmUrl.view + separators.equal + eventId + separators.and + zmUrl.token + separators.equal + token
      return buildedUrl;
    }
  }

  eventsList(token: string, startDate: string, endDate: string, startTime: string, endTime: string, camId: string, conf: IConf): string {
    const monitor = ((camId !== null || camId !== undefined) ? (zmUrl.monitorId + camId + separators.slash + zmUrl.startTime) : (zmUrl.startTime + separators.slash));
    const buildedUrl = conf.protocol + conf.baseUrl + zmUrl.events + monitor + startDate + zmUrl.percent + startTime +
      zmUrl.endtime + endDate + zmUrl.percent + endTime + separators.dot + zmUrl.json + zmUrl.token + separators.equal + token;
    return buildedUrl;
  }

}