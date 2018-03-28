// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/authorization
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/**
 * Authorization metadata stored via Reflection API
 */
export interface AuthorizationMetadata {
  allow?: string[];
  deny?: string[];
  scopes?: string[];
}

export enum AuthorizationDecision {
  ALLOW = 'Allow',
  DENY = 'Deny',
  AUDIT = 'Audit',
}

export interface Principal {
  name: string;
  type: string;
  // tslint:disable-next-line:no-any
  [attribute: string]: any;
}

export interface Role {
  name: string;
  type: string;
  // tslint:disable-next-line:no-any
  [attribute: string]: any;
}

export interface SecurityContext {
  principals: Principal[];
  roles: Role[];
}

export type AuthorizeFn = (
  caller: SecurityContext,
  target: AuthorizationMetadata,
) => Promise<AuthorizationDecision>;
