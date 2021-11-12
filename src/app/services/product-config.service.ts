import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductNames } from '../shared/model/product_names';

@Injectable({
  providedIn: 'root'
})
export class ProductConfigService {

  /**
   * List of all products name from the file-config-products.json file
   */
   product_list_names: ProductNames[];

  /** 
   * the tax percentage, loaded from the file-config-products.json file
  */
  tax_percentage: number = null;

  /**
   * For detecting changes
   */
  $detectChanges: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

  /**
   * Load the product name list from file-config-products.json file, change the translated_label following the
   * selected language
   * 
   * @param lang the selected language
   */
   loadProductNameList(lang: string): void {
    this.http.get("./assets/config/file-config-products.json",
    {
      responseType: "json"
    }).subscribe(config_list => {
      this.tax_percentage = config_list["tax_percentage"];
      this.product_list_names = [];
      config_list["product_names"].forEach(product_names => {
        this.product_list_names.push({
          "translated_label": product_names[lang],
          "fr_label": product_names["fr"]
        })
      });
      this.$detectChanges.next(!this.$detectChanges.value);
    });
  }

  /**
   * Get the list of loaded product names
   * @returns The list of loaded product names
   */
  getProductNameList(): ProductNames[] {
    if (this.product_list_names === undefined || this.product_list_names === null) {
      this.loadProductNameList("fr");
    }
    return this.product_list_names;
  }

  /**
   * Get the loaded tax percentage
   * @returns loaded the tax percentage
   */
  getTaxPercentage(): number {
    if (this.tax_percentage === undefined || this.tax_percentage === null) {
      this.loadProductNameList("fr");
    }
    return this.tax_percentage;
  }

  /**
   * For detecting changes from the list
   * @returns a behavior subject to detect changes
   */
  observeChanges(): BehaviorSubject<boolean> {
    return this.$detectChanges;
  }

  setTaxPercentage(new_tax: number) {
    this.tax_percentage = new_tax;
    this.$detectChanges.next(!this.$detectChanges.value);
  }
}
