// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/authorization
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import {authorize, getAuthorizeMetadata} from '../..';

describe('Authentication', () => {
  describe('@authorize decorator', () => {
    it('can add authorize metadata to target method', () => {
      class TestClass {
        @authorize({allow: ['ADMIN'], scopes: ['secret.read']})
        getSecret() {}
      }

      const metaData = getAuthorizeMetadata(TestClass, 'getSecret');
      expect(metaData).to.eql({
        allow: ['ADMIN'],
        scopes: ['secret.read'],
      });
    });

    it('can add allowAll to target method', () => {
      class TestClass {
        @authorize.allowAll()
        getSecret() {}
      }

      const metaData = getAuthorizeMetadata(TestClass, 'getSecret');
      expect(metaData).to.eql({
        allow: ['$everyone'],
      });
    });

    it('can add denyAll to target method', () => {
      class TestClass {
        @authorize.denyAll()
        getSecret() {}
      }

      const metaData = getAuthorizeMetadata(TestClass, 'getSecret');
      expect(metaData).to.eql({
        deny: ['$everyone'],
      });
    });
  });
});
