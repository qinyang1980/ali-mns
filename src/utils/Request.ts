import * as PROMISE from 'promise';
import * as Request from 'request';

// tslint:disable: no-string-literal
const request: { new (input: RequestInfo, init?: RequestInit): Request; prototype: Request } = Request;
request['requestP'] = PROMISE.denodeify(request);
request['debug'] = false;

export default request;
