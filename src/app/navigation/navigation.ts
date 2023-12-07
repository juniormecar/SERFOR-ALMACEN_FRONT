import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        icon     : 'apps',
        children : [
            {
                id       : '1',
                title    : 'Ingresos',
                type     : 'collapsable',
                icon     : 'exit_to_app',
                children : [
                    {
                        id   : '1',
                        title: 'Bandeja de Ingresos',
                        type : 'item',
                        url  : '/bandeja-recurso'
                    }
                ]
            },
            {
                id       : '2',
                title    : 'Almacenes',
                type     : 'collapsable',
                icon     : 'store',
                children : [
                    {
                        id   : '1',
                        title: 'Bandeja de Almacén',
                        type : 'item',
                        url  : '/bandeja-almacen'
                    }
                ]
            },
            {
                id       : '3',
                title    : 'Reportes',
                type     : 'collapsable',
                icon     : 'description',
                children : [
                    // {
                    //     id   : '1',
                    //     title: 'Transferencia a Beneficiario',
                    //     type : 'item',
                    //     url  : '/transferencia'
                    // },
                    // {
                    //     id   : '1',
                    //     title: 'Transferencia entre Almacenes',
                    //     type : 'item',
                    //     url  : '/transferencia-almacen'
                    // },
                    {
                        id   : '1',
                        title: 'Kardex',
                        type : 'item',
                        url  : '/kardex'
                    },
                    {
                        id   : '2',
                        title: 'Reportes',
                        type : 'item',
                        url  : '/reportes'
                    },
                ]
            },
            {
                id       : '4',
                title    : 'Inventario',
                type     : 'collapsable',
                icon     : 'widgets',
                children : [
                    {
                        id   : '1',
                        title: 'Bandeja de Inventario',
                        type : 'item',
                        url  : '/bandeja-inventario'
                    }
                ]
            },
            {
                id       : '5',
                title    : 'Mantenimiento',
                type     : 'collapsable',
                icon     : 'business_center',
                children : [
                    {
                        id   : '1',
                        title: 'Bandeja de ATF',
                        type : 'item',
                        url  : '/bandeja-atf'
                    },
                    {
                        id   : '2',
                        title: 'Bandeja de Puesto de Control',
                        type : 'item',
                        url  : '/bandeja-puestoControl'
                    },
                    {
                        id   : '3',
                        title: 'Bandeja de Tipo Parámetro',
                        type : 'item',
                        url  : '/bandeja-tipoParametro'
                    },
                    {
                        id   : '4',
                        title: 'Bandeja de Parámetro',
                        type : 'item',
                        url  : '/bandeja-parametro'
                    }
                ]
            }
        ]
        
    }
];
