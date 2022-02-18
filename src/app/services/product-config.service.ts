import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ProductNames} from '../shared/model/product-names';

@Injectable({
  providedIn: 'root'
})
export class ProductConfigService {

  /**
   * List of all products name from the file-config-products.json file
   */
  productListNames: ProductNames[];

  /**
   * the tax percentage, loaded from the file-config-products.json file
   */
  taxPercentage: number = null;

  /**
   * Company information
   */
  companyName: string = null;
  companyAddress: string = null;

  /**
   * For detecting changes
   */
  $detectChanges: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient) {
  }

  /**
   * Load the product name list from file-config-products.json file, change the translated_label following the
   * selected language
   *
   * @param lang the selected language
   */
  loadProductNameList(lang: string): void {
    this.http.get('./assets/config/file-config-products.json',
      {
        responseType: 'json'
      }).subscribe(configList => {
      this.taxPercentage = configList['tax_percentage'];
      this.companyName = configList['company_name'];
      this.companyAddress = configList['company_address'];
      this.productListNames = [];
      configList['product_names'].forEach(productNames => {
        this.productListNames.push({
          translatedLabel: productNames[lang],
          frLabel: productNames.fr
        });
      });
      this.$detectChanges.next(!this.$detectChanges.value);
    });
  }

  /**
   * Get the list of loaded product names
   *
   * @returns The list of loaded product names
   */
  getProductNameList(): ProductNames[] {
    if (this.productListNames === undefined || this.productListNames === null) {
      this.loadProductNameList('fr');
    }
    return this.productListNames;
  }

  /**
   * Get the loaded tax percentage
   *
   * @returns loaded the tax percentage
   */
  getTaxPercentage(): number {
    if (this.taxPercentage === undefined || this.taxPercentage === null) {
      this.loadProductNameList('fr');
    }
    return this.taxPercentage;
  }

  /**
   * Get Company Name
   */
  getCompanyName(): string {
    if (this.companyName === undefined || this.companyName === null) {
      this.loadProductNameList('fr');
    }
    return this.companyName;
  }

  /**
   * Get Company Address
   */
  getCompanyAddress(): string {
    if (this.companyAddress === undefined || this.companyAddress === null) {
      this.loadProductNameList('fr');
    }
    return this.companyAddress;
  }

  /**
   * For detecting changes from the list
   *
   * @returns a behavior subject to detect changes
   */
  observeChanges(): BehaviorSubject<boolean> {
    return this.$detectChanges;
  }

  setTaxPercentage(newTax: number) {
    this.taxPercentage = newTax;
    this.$detectChanges.next(!this.$detectChanges.value);
  }
}
