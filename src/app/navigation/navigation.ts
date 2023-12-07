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
                icon     : 'dashboard',
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
                icon     : 'dashboard',
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
                icon     : 'today',
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
                ]
            },
            {
                id       : '4',
                title    : 'Inventario',
                type     : 'collapsable',
                icon     : 'today',
                children : [
                    {
                        id   : '1',
                        title: 'Bandeja de Inventario',
                        type : 'item',
                        url  : '/bandeja-inventario'
                    }
                ]
            }
        ]
        
    }
];
