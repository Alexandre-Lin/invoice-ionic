import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductConfigService } from '../services/product-config.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  isZh = false;

  constructor(private translateService: TranslateService, private productConfigService: ProductConfigService) {
    if (this.translateService.currentLang === 'fr')
    {
      this.isZh = false;
      this.productConfigService.loadProductNameList('fr');
    }
    else
    {
      this.isZh = true;
      this.productConfigService.loadProductNameList('zh');
    }
  }

  /**
   * To check whether the selected language is French or Chinese each time the language toggle button is pressed
   */
  checkCurrentLanguage(): void {
    if (this.translateService.currentLang === 'fr')
    {
      this.translateService.use('zh');
      this.isZh = true;
      this.productConfigService.loadProductNameList('zh');
    }
    else
    {
      this.translateService.use('fr');
      this.isZh = false;
      this.productConfigService.loadProductNameList('fr');
    }
  }
}
