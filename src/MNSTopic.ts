import * as Url from 'url';
import * as Util from 'util';
import { Account } from './Account';
import { IMNSTopic } from './Interfaces';
import { MNS } from './MNS';
import { Region } from './Region';
import debug from './utils/Debug';

export class MNSTopic extends MNS implements IMNSTopic {
  public constructor(account: Account, region?: string | Region) {
    super(account, region);
    // make url
    this._urlTopic = this.makeTopicURL();
  }

  // List all topics.
  public listTopicP(prefix?: string, pageSize?: number, pageMarker?: string) {
    const headers = {};
    if (prefix) headers['x-mns-prefix'] = prefix;
    if (pageMarker) headers['x-mns-marker'] = pageMarker;
    if (pageSize) headers['x-mns-ret-number'] = pageSize;
    const url = this._urlTopic.slice(0, -1);
    debug('GET ' + url);
    return this._openStack.sendP('GET', url, null, headers);
  }

  // Create a topic
  public createTopicP(name: string, options?: any) {
    const body = { Topic: '' };
    if (options) body.Topic = options;
    const url = Url.resolve(this._urlTopic, name);
    debug('PUT ' + url, body);
    return this._openStack.sendP('PUT', url, body);
  }

  // Delete a topic
  public deleteTopicP(name: string) {
    const url = Url.resolve(this._urlTopic, name);
    debug('DELETE ' + url);
    return this._openStack.sendP('DELETE', url);
  }

  private makeTopicURL() {
    return Util.format(
      this._patternTopic,
      this._account.getHttps() ? 'https' : 'http',
      this._account.getAccountId(),
      this._region.toString(),
    );
  }

  private _patternTopic = '%s://%s.mns.%s.aliyuncs.com/topics/';
  private _urlTopic: string;
}
