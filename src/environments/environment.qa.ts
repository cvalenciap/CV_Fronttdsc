// This file can be replaced during build by using the `fileReplacements` array.
// `ng build -c qa` replaces `environment.ts` with `environment.qang serve.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
/*   mockServices: false, */
  serviceEndpoint: 'http://apin1qa.sedapal.com.pe/stdc/api',
  serviceEndpointAuth: 'http://apin1qa.sedapal.com.pe/stdc/auth',
  serviceFileServerEndPoint: 'http://apin1qa.sedapal.com.pe/fileserver/STDC',
  pathMesaPartes: 'mesa',
  max_valor_plazo: 99,
  firmaDisponible: true,
  firmaEndpoint: 'http://1.1.110.117:8180/SignnetSignature/Servicio',
  firmaRutaBase: '/Firmas',
  firmaRutaImagenes: '/imagenes/',
  firmaRutaOrigen: '/salientes/2019/',
  firmaRutaDestino: '/salientes/2019/'
};
