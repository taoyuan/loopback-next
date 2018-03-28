// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/authorization
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AuthorizationBindings} from './keys';
import {Component, ProviderMap} from '@loopback/core';
import {AuthorizationProvider} from './providers/authorize';
import {AuthorizationMetadataProvider} from './providers/authorization-metadata';

export class AuthenticationComponent implements Component {
  providers?: ProviderMap;

  constructor() {
    this.providers = {
      [AuthorizationBindings.AUTHORIZE_ACTION.key]: AuthorizationProvider,
      [AuthorizationBindings.AUTHORIZE_METADATA
        .key]: AuthorizationMetadataProvider,
    };
  }
}
