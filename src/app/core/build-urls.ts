import { separators, streamingEventMode, zmUrl } from "../enums/enums";
import { IConf } from "../interfaces/IConf";

export class UrlsBuilder {
  constructor() { }

  login(username: string, password: string, conf: IConf) {
    const buildedUrl = conf.protocol + conf.baseUrl + zmUrl.host + separators.slash + zmUrl.login + separators.dot + zmUrl.json + separators.question + zmUrl.user +
      separators.equal + username + separators.and + zmUrl.pass + separators.equal + password;
    return buildedUrl;
  }

  getCamListInfo(token: string, conf: IConf) {
    const buildedUrl = conf.protocol + conf.baseUrl + zmUrl.monitors + separators.dot + zmUrl.json + separators.question + zmUrl.token + separators.equal + token;
    return buildedUrl;
  }

  liveStream(camId: string, token: string, streamUrl: string, conf: IConf, streamScale: string, streamFps: string): string {
    const buildedUrl = conf.protocol + streamUrl + zmUrl.cgiBinPath + separators.question + zmUrl.scale + separators.equal + streamScale + separators.and +
      zmUrl.mode + separators.equal + streamingEventMode.jpeg + separators.and + zmUrl.maxfps + separators.equal + streamFps + separators.and +
      zmUrl.buffer + separators.equal + conf.buffer + separators.and + zmUrl.monitor + separators.equal + camId + separators.and + zmUrl.token + separators.equal + token;
    return buildedUrl;
  }

  liveStreamDetail(camId: string, token: string, conf: IConf, detailStreamingScale: string, detailStreamingMaxfps: string): string {
    const buildedUrl = conf.protocol + conf.streamUrl1 + zmUrl.cgiBinPath + separators.question + zmUrl.scale + separators.equal + detailStreamingScale + separators.and +
      zmUrl.mode + separators.equal + streamingEventMode.jpeg + separators.and + zmUrl.maxfps + detailStreamingMaxfps + separators.and +
      zmUrl.buffer + conf.buffer + separators.and + zmUrl.monitor + separators.equal + camId + separators.and + zmUrl.token + separators.equal + token;
    return buildedUrl;
  }

  eventStreamDetail(eventId: string, token: string, mode: string, conf: IConf, frame: string, streamScale: string): string {
    if (mode === streamingEventMode.jpeg) {
      const buildedUrl = conf.protocol + conf.streamUrl1 + zmUrl.cgiBinPath + separators.question + zmUrl.scale + separators.equal + streamScale +
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
    const monitor = ((camId !== null && camId !== undefined) ? (zmUrl.monitorId + separators.doublePoints + camId + separators.slash + zmUrl.startTime) : zmUrl.startTime );
    const buildedUrl = conf.protocol + conf.baseUrl + zmUrl.events + monitor + startDate + zmUrl.percent + startTime + separators.slash +
      zmUrl.endtime + endDate + zmUrl.percent + endTime + separators.dot + zmUrl.json + separators.question + zmUrl.token + separators.equal + token;
    return buildedUrl;
  }

}