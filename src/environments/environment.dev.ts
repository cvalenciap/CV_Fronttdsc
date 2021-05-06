// This file can be replaced during build by using the `fileReplacements` array.
// `ng build -c dev` replaces `environment.ts` with `environment.dev.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  /* mockServices: false, */
  serviceEndpoint: 'http://sedapal.test:8080/stdc/api',
  serviceEndpointAuth: 'http://sedapal.test:8080/stdc/auth',
  serviceFileServerEndPoint: 'http://sedapal.test:8080/fileserver',
  pathMesaPartes: 'mesa',
  max_valor_plazo: 99,
  firmaDisponible: false,
  firmaEndpoint: 'http://1.1.110.117:8180/SignnetSignature/Servicio',
  firmaRutaBase: '/Firmas',
  firmaRutaImagenes: '/imagenes/',
  firmaRutaOrigen: '/salientes/',
  firmaRutaDestino: '/salientes/'
};
/*
export const environment = {
  production: true,
  mockServices: false,
  serviceEndpoint: 'http://sedapal.test:8080/api',
  serviceEndpointAuth: 'http://sedapal.test:8080/auth',
  serviceFileServerEndPoint: 'http://sedapal.test:8080/fileserver/',
  pathMesaPartes: 'mesa',
  firmaDisponible: true,
  firmaEndpoint: 'http://1.1.110.117:8180/SignnetSignature/Servicio',
  firmaRutaBase: '/Firmas',
  firmaRutaImagenes: '/imagenes/',
  firmaRutaOrigen: '/salientes/',
  firmaRutaDestino: '/salientes/'
};*/


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
