// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/authorization
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  MetadataInspector,
  Constructor,
  MethodDecoratorFactory,
} from '@loopback/context';
import {AuthorizationBindings} from '../keys';
import {AuthorizationMetadata} from '../types';

/**
 * Mark a controller method as requiring authorized user.
 *
 * @param spec Authorization metadata
 */
export function authorize(spec: AuthorizationMetadata) {
  return MethodDecoratorFactory.createDecorator<AuthorizationMetadata>(
    AuthorizationBindings.METADATA,
    spec,
  );
}

export namespace authorize {
  export const allowAll = () => authorize({allow: ['$everyone']});
  export const allowAuthenticated = () =>
    authorize({allow: ['$authenticated']});
  export const denyAll = () => authorize({deny: ['$everyone']});
  export const denyUnauthenticated = () =>
    authorize({deny: ['$anonymous', '$unauthenticated']});
}

/**
 * Fetch authorization metadata stored by `@authorize` decorator.
 *
 * @param controllerClass Target controller
 * @param methodName Target method
 */
export function getAuthorizeMetadata(
  controllerClass: Constructor<{}>,
  methodName: string,
): AuthorizationMetadata | undefined {
  return MetadataInspector.getMethodMetadata<AuthorizationMetadata>(
    AuthorizationBindings.METADATA,
    controllerClass.prototype,
    methodName,
  );
}
