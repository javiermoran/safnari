'use strict';

import version from './version.routes';
import users from './users.routes';
import collections from './collections.routes';
import types from './types.routes';
import items from './items.routes';
import statistics from './statistics.routes';
import tags from './tags.routes';

export default { 
  version, 
  users, 
  collections, 
  types, 
  items, 
  statistics,
  tags
};
