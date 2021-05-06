// This file can be replaced during build by using the `fileReplacements` array.
// `ng build -c stage` replaces `environment.ts` with `environment.stage.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
/*   mockServices: false, */
  serviceEndpoint: 'http://apitra.sedapal.com.pe/stdc/api',
  serviceEndpointAuth: 'http://apitra.sedapal.com.pe/stdc/auth',
  serviceFileServerEndPoint: 'http://apitra.sedapal.com.pe/fileserver/STDC',
  pathMesaPartes: 'mesa',
  max_valor_plazo: 99,
  firmaDisponible: true,
  firmaEndpoint: 'http://1.1.110.117:8180/SignnetSignature/Servicio',
  firmaRutaBase: '/Firmas',
  firmaRutaImagenes: '/imagenes/',
  firmaRutaOrigen: '/salientes/2019/',
  firmaRutaDestino: '/salientes/2019/'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
