import { URLSearchParams } from '@angular/http';
import * as _ from 'lodash';

import { flattenObject } from '../../utils/util';

export const URLParamsBuilder = {
  build: (params: any): URLSearchParams => {
    if (!_.isObject(params)) {
      return null;
    }

    let paramsObj = flattenObject(params);
    let result: URLSearchParams = new URLSearchParams();
    for (let key in paramsObj) {
      let value = paramsObj[key];

      if (_.isFunction(value)) {
        continue;
      }

      if (_.isArray(value)) {
        (<string[]>value).forEach(v => {
          result.append(key, v);
        });
        continue;
      }

      result.set(key, <string>value);
    }
    return result;
  }
};
