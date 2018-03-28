// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/authorization
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/context';
import {AuthorizationMetadata, AuthorizeFn} from './types';

/**
 * Binding keys used by this component.
 */
export namespace AuthorizationBindings {
  export const AUTHORIZE_ACTION = BindingKey.create<AuthorizeFn>(
    'authorization.actions.authorize',
  );
  export const AUTHORIZE_METADATA = BindingKey.create<AuthorizationMetadata>(
    'authorization.operationMetadata',
  );
  export const METADATA = 'authorization.operationMetadata';
}
