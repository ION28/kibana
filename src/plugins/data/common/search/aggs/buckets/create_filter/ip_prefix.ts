/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { buildRangeFilter, RangeFilterParams } from '@kbn/es-query';
import { CidrMask } from '../lib/cidr_mask';
import { IBucketAggConfig } from '../bucket_agg_type';
import { IpPrefixKey } from '../lib/ip_prefix';

export const createFilterIpPrefix = (aggConfig: IBucketAggConfig, key: IpPrefixKey) => {
  let ipAddress = key.address;

  /*
   * Can occurs when both IPv4 and IPv6 addresses are both in the field being
   * aggregated. When prefix_length is < 96, ES will group all IPv4 addresses 
   * into an IPv6 address and display that as the key, thus no mapping is required.
   * Per RFC 4038 section 4.2, the IPv6 address ::FFFF:x.y.z.w represents the IPv4
   * address x.y.z.w. Therefore, if they key is an IPv4 address (e.g. it contains
   * a dot) and the requested prefix is >= 96, then appending ::ffff: will properly
   * map the IPv4 address to IPv6 according to the RFC mentioned above.
   */
  if (ipAddress.includes('.') && key.prefix_length >= 96) {
    ipAddress = '::ffff:' + key.address;
  }

  const range = new CidrMask(ipAddress + '/' + key.prefix_length).getRange();

  return buildRangeFilter(
    aggConfig.params.field,
    { gte: range.from, lte: range.to },
    aggConfig.getIndexPattern()
  );
};
