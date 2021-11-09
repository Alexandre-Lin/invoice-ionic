import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  isZh : boolean = false;

  constructor(private translateService: TranslateService) {
    if (this.translateService.currentLang == "fr")
      this.isZh = false;
    else
      this.isZh = true;
  }

  /**
   * To check whether the selected language is French or Chinese each time the language toggle button is pressed
   */
  checkCurrentLanguage(): void {
    if (this.translateService.currentLang == "fr")
    {
      this.translateService.use("zh");
      this.isZh = true;
    }
    else 
    {
      this.translateService.use("fr")
      this.isZh = false;
    }
  }

}
