/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { buildRangeFilter } from '@kbn/es-query';
import { IBucketAggConfig } from '../bucket_agg_type';

export const createFilterIpPrefix = (aggConfig: IBucketAggConfig) => {
  return buildRangeFilter(
    aggConfig.params.field,
    aggConfig.getIndexPattern()
  );
};
