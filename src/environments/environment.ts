// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr       : false,
    urlProcesos: "https://qa.serfor.gob.pe/AlmacenBackend",  // almacen
    urlServiciosExternos: 'https://sniffs.serfor.gob.pe/apis/extserv-rest/1.0/',   // servicios externos
    urlSeguridad: "https://qa.serfor.gob.pe/sgiseguridad/",   // seguridad
    urlNewCoreCentral:"https://qa.serfor.gob.pe/corecentral/", // core central
    urlBaseImagen:"/almacen"//NO
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
