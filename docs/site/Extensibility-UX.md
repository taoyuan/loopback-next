---
lang: en
title: 'Extensibility UX'
keywords: LoopBack 4.0, LoopBack 4
tags:
sidebar: lb4_sidebar
permalink: /doc/en/lb4/Extensibility-UX.html
summary:
---

## Overview

https://github.com/strongloop/loopback-next/issues/1034

https://github.com/strongloop/loopback-next/issues/953

List of issues in the current design of Extensions:

- Writing an extension class requires a lot of hand-written glue. Developers
have to explicitly list all controllers, bindings, etc. they want to add to the
app. We should have a conventional bootstrapper that can scan filesystem and
discover artifacts to add to the app automatically. Ideally, most of the
conventions should be same for applications and extensions, so that LoopBack
users have only one set of conventions to learn, and the bootstrapper package
has only one set of conventions to implement.

(This has been partially implemented in `@loopback/boot`).

- Adding support for new type of artifacts that can be contributed by extensions
requires changes in several places. For example, we already have API for binding
classes (app.bind('foo').toClass(Foo)), but components cannot leverage it until
app.component() is updated to support it as well.

- Even though it's easy for a component to contribute Providers for DI, the
extension cannot control binding settings like scope (SINGLETON), tags, etc.

- The ability to expose an extension point to allow customization of a service
and fall back to a default implementation. For example, a user management
component by default uses bcrypt for password hashing but it should allow an
optional external binding for the hashing function.

- The ability to organize artifacts as extension points/extensions, for example,
bootstrapper -> booters, authenticator -> strategies, rest -> servers, even app
-> components. The extension point should be able to depend on a list or map of
extension instances for delegation. Each extension point and extension should be
able to receive corresponding configurations.

- The ability to maintain isolated and connected contexts for an app, a
component, or an extension point.


## Use cases

- Support for various types of artifacts
  - controllers
  - repositories
  - data sources
  - models
  - mixins
  - booters
  - servers
  - connectors

Application developers and extension developers should be able to contribute
artifacts.

- Promote decoupling with extension point/extension pattern
  - boostrapper -> booters
  - authentication -> strategies
  - authorization -> schemes
  - logging -> loggers
  - validation -> validators
  - serialization/deserializtion -> serializers/deserializers
  - password hashing -> hashers
  - transport -> servers

See https://github.com/strongloop/loopback-next/pull/657

## Contribute extensions to an existing artifact type


## Create a new extension point


## Associate extensions with an extension point

- Explicit registration by api

```ts
application.controller(CustomerController);
```

- Bind to a key namespace for the artifact type

```ts
application.bind(`controllers.CustomerController`).toClass(CustomerController);
```

- By directory/file convention for discovery/boot

Export `CustomerController` class from `controllers/customer.controller.ts`.

- Extra metadata to help discovery/registration

```ts
@injectable({type: 'controller', tags: {name: 'customer-controller'}})
export class CustomerController {

}
```

See https://github.com/strongloop/loopback-next/pull/992

- Bind the extension under the key namespace of the extension point. For example:
```ts
context.bind(`authentication.strategies.LDAPStrategy`).toClass(LDAPStrategy);
```

- Tag an extension binding with `{extensionPoint: 'authentication.strategies'}`.
For example:
```ts
context.bind(`authentication.strategies.LDAPStrategy`)
  .toClass(LDAPStrategy)
  .tag({extensionPoint: 'authentication.strategies'});
```

See https://github.com/strongloop/loopback-next/pull/1262

- Use an API
```ts
application.extension('authentication.strategies', LDAPStrategy);
```

## Configure bindings

https://github.com/strongloop/loopback-next/pull/983

Add context.configure() to configure bindings

```ts
context.configure('controllers.CustomerController').to({db: 'mysql'});
```

Add context.getConfig/getConfigSync() to look up config for a binding
```ts
const config = await context.getConfig('controllers.CustomerController');
```

Add @injection.config() to receive injection of config
```ts
export class CustomerController {
  @inject.config()
  private config: CustomerControllerConfig;
}
```

## Access extensions from an extension point

- Look up `Context` with tags
- Dependency injection via `@inject.extensions`

## Typical delegation pattern from extension point to extension(s)

- Visitor: pass control to all registered extensions
- Delegator: use the metadata to decide which extension to use, for example,
find an authentication strategy provider based on the strategy name
- Select: select the utility based on the running environment, for example,
sha1 for testing while bcrypt for production

## Bundle extension points/extensions

Package extension points and/or extensions as a npm module and export them using
component bindings.

log-component.ts
```ts
export class LogComponent extends Component {
  // ...
}
```
See https://github.com/strongloop/loopback-next/pull/929
