import * as Url from 'url';
import * as Util from 'util';
import { Account } from './Account';
import { IMNS } from './Interfaces';
import { OpenStack } from './OpenStack';
import { City, NetworkType, Region, Zone } from './Region';
import debug from './utils/Debug';

// The MNS can list, create, delete, modify the mq.
export class MNS implements IMNS {
  // The constructor. account: ali account; region: can be "hangzhou", "beijing" or "qingdao", default is "hangzhou"
  constructor(account: Account, region?: string | Region) {
    // save the input arguments
    this._account = account;
    // region
    if (region) {
      if (typeof region === 'string') this._region = new Region(region, NetworkType.Public, Zone.China);
      else this._region = region;
    }

    // make url
    this._url = this.makeURL();

    // create the OpenStack object
    this._openStack = new OpenStack(account);
  }

  // List all mns.
  public listP(prefix?: string, pageSize?: number, pageMarker?: string) {
    const headers = {};
    if (prefix) headers['x-mns-prefix'] = prefix;
    if (pageMarker) headers['x-mns-marker'] = pageMarker;
    if (pageSize) headers['x-mns-ret-number'] = pageSize;
    const url = this._url.slice(0, -1);
    debug('GET ' + url);
    return this._openStack.sendP('GET', url, null, headers);
  }

  // Create a message queue
  public createP(name: string, options?: any) {
    const body = { Queue: '' };
    if (options) body.Queue = options;
    const url = Url.resolve(this._url, name);
    debug('PUT ' + url, body);
    return this._openStack.sendP('PUT', url, body);
  }

  // Delete a message queue
  public deleteP(name: string) {
    const url = Url.resolve(this._url, name);
    debug('DELETE ' + url);
    return this._openStack.sendP('DELETE', url);
  }

  private makeURL() {
    return Util.format(this._pattern, this._account.getHttps() ? 'https' : 'http', this._account.getAccountId(), this._region.toString());
  }

  protected _account: Account; // Ali account
  protected _region = new Region(City.Hangzhou);
  private _pattern = '%s://%s.mns.%s.aliyuncs.com/queues/';
  private _url: string; // mns url
  protected _openStack: OpenStack;
}
