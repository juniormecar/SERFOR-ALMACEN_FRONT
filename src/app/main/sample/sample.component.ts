import { Component } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

@Component({
    selector   : 'sample',
    templateUrl: './sample.component.html',
    styleUrls  : ['./sample.component.scss']
})
export class SampleComponent
{
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _fuseConfigService: FuseConfigService,
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._fuseConfigService.config = {
            layout: {
              navbar: {
                hidden: false
              },
              toolbar: {
                hidden: true
              },
              footer: {
                hidden: true
              },
              sidepanel: {
                hidden: true
              }
            }
          };
    }
}
