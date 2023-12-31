// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: true,
    hmr       : false,
    urlProcesos: "http://localhost:8080",  // almacen
    urlServiciosExternos: 'http://10.6.1.162/mcsniffsextserv-rest/',   // servicios externos
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
