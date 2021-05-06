 //Servidor local
  export const environment = {
  production: false, 
  serviceEndpoint: 'http://localhost:8080/api',
  serviceEndpointAuth: 'http://localhost:8080/auth',
  serviceFileServerEndPoint: 'http://api.sedapal.test:8080/fileserver',
  pathMesaPartes: 'mesa',
  max_valor_plazo: 999,
  firmaDisponible: false,
  firmaEndpoint: 'http://1.1.110.117:8180/SignnetSignature/Servicio',
  firmaRutaBase: '/Firmas',
  firmaRutaImagenes: '/imagenes/',
  firmaRutaOrigen: '/salientes/',
  firmaRutaDestino: '/salientes/'
}; 

/*
  ENVIRONMENT
  SERVIDOR 10.240.147.46 NGNIX CANVIA
*/
 
 /* export const environment = {
  production: false,
  mockServices: true,
  serviceEndpoint: 'http://api.sedapal.test/stdc/api',
  serviceEndpointAuth: 'http://api.sedapal.test/stdc/auth',
  serviceFileServerEndPoint: 'http://api.sedapal.test/fileserver/STDC',
  pathMesaPartes: 'mesa',
  max_valor_plazo: 999,
  firmaDisponible: false,
  firmaEndpoint: 'http://1.1.110.117:8180/SignnetSignature/Servicio',
  firmaRutaBase: '/Firmas',
  firmaRutaImagenes: '/imagenes/',
  firmaRutaOrigen: '/salientes/',
  firmaRutaDestino: '/salientes/'
};  */




//Servidor SEDAPAL Desarrollo

/* export const environment = {
  production: false,
  serviceEndpoint: 'http://apitra.sedapal.com.pe/stdc/api',
  serviceEndpointAuth: 'http://apitra.sedapal.com.pe/stdc/auth',
  serviceFileServerEndPoint: 'http://apitra.sedapal.com.pe/fileserver/stdc',
  pathMesaPartes: 'mesa',
  max_valor_plazo: 99,
  firmaDisponible: true,
  firmaEndpoint: 'http://1.1.110.117:8180/SignnetSignature/Servicio',
  firmaRutaBase: '/Firmas',
  firmaRutaImagenes: '/imagenes/',
  firmaRutaOrigen: '/salientes/2019/',
  firmaRutaDestino: '/salientes/2019/'
}; */
/*
 export const environment = {
  production: false,
  //serviceEndpoint: 'http://apitra.sedapal.com.pe/stdc/api',
  //serviceEndpointAuth: 'http://apitra.sedapal.com.pe/stdc/auth',
  //serviceFileServerEndPoint: 'http://apitra.sedapal.com.pe/fileserver/, 
  serviceEndpoint:     'http://1.1.192.115:8080/stdc/api',
  serviceEndpointAuth: 'http://1.1.192.115:8080/stdc/auth',
  serviceFileServerEndPoint: 'http://1.1.192.115:8080/fileserver/STDC',
  pathMesaPartes: 'mesa',
  max_valor_plazo: 99,
  firmaDisponible: true,
  firmaEndpoint: 'http://1.1.110.117:8180/SignnetSignature/Servicio',
  firmaRutaBase: '/Firmas',
  firmaRutaImagenes: '/imagenes/',
  firmaRutaOrigen: '/salientes/2019/',
  firmaRutaDestino: '/salientes/2019/'
};

*/
//Servidor QA

/* export const environment = {
  production: false,
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
}; */
