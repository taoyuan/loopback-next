// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/service
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import {Context} from '@loopback/context';
import {serviceProxy} from '../../../';

import {DataSourceConstructor, juggler} from '../../../';

interface GeoCode {
  lat: number;
  lng: number;
}

interface GeoService {
  geocode(street: string, city: string, zipcode: string): Promise<GeoCode[]>;
}

class MyController {
  constructor(@serviceProxy('googleMap') public geoService: GeoService) {}
}

describe('serviceProxy decorator', () => {
  let ctx: Context;
  let ds: juggler.DataSource;

  before(function() {
    ds = new DataSourceConstructor({
      name: 'db',

      connector: 'loopback-connector-rest',
      strictSSL: false,
      debug: false,
      defaults: {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
      },
      operations: [
        {
          template: {
            method: 'GET',
            url: 'http://maps.googleapis.com/maps/api/geocode/{format=json}',
            query: {
              address: '{street},{city},{zipcode}',
              sensor: '{sensor=false}',
            },
            options: {
              strictSSL: true,
              useQuerystring: true,
            },
            responsePath: '$.results[0].geometry.location',
          },
          functions: {
            geocode: ['street', 'city', 'zipcode'],
          },
        },
      ],
    });

    ctx = new Context();
    ctx.bind('datasources.googleMap').to(ds);
    ctx.bind('controllers.MyController').toClass(MyController);
  });

  it('supports @serviceProxy(dataSourceName)', async () => {
    const myController = await ctx.get<MyController>(
      'controllers.MyController',
    );
    expect(myController.geoService).to.be.a.Function();
  });

  it('supports @serviceProxy(dataSource)', async () => {
    class MyControllerWithService {
      constructor(@serviceProxy(ds) public geoService: GeoService) {}
    }

    ctx
      .bind('controllers.MyControllerWithService')
      .toClass(MyControllerWithService);

    const myController = await ctx.get<MyControllerWithService>(
      'controllers.MyControllerWithService',
    );
    expect(myController.geoService).to.be.a.Function();
  });
});
