import { Component, OnChanges, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ProductConfigService } from '../services/product-config.service';
import { Invoice } from '../shared/model/invoice';
import { Product } from '../shared/model/product';
import { ProductNames } from '../shared/model/product_names';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  /**
  * List of all products name loaded from the ProductConfigService
  */
  product_list_names: ProductNames[] = [];

  invoice: Invoice = {
    date: moment(),
    productList: [],
    tax: 20,
    total: 0
  }

  newProduct: Product = {
    designation: null,
    price: null,
    quantity: null
  }

  constructor(private productConfigService: ProductConfigService, private translateService: TranslateService,
    private alertController: AlertController) {
  }

  ngOnInit(): void {
    this.product_list_names = this.productConfigService.getProductNameList();
    this.invoice.tax = this.productConfigService.getTaxPercentage();
    this.productConfigService.observeChanges().subscribe(() => {
      this.product_list_names = this.productConfigService.getProductNameList();
      this.invoice.tax = this.productConfigService.getTaxPercentage();
    });
  }

  /**
   * If the selected option for designation is 'custom'
   */
  selectChanged(selectedOption: string) {
    if (selectedOption === this.translateService.instant('CUSTOM')) {
      this.inputCustomSelectValue();
    } else {
      this.newProduct.designation = selectedOption;
    };
  };

  /**
   * To input new value for product designation
   */
  async inputCustomSelectValue() {
    let alert = await this.alertController.create({
      message: this.translateService.instant('CUSTOM'),
      inputs: [
        {
          name: 'custom',
          placeholder: this.translateService.instant('CUSTOM')
        }
      ],
      buttons: [
        {
          text: this.translateService.instant('CANCEL'),
          role: 'cancel',
          handler: data => {
            console.log('Canceled');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.newProduct.designation = data.custom;
          }
        }
      ]
    });

    await alert.present();
  };

/**
 * 
 * @returns if the new given product has all data input
 */
  isNewProductEmpty(): boolean {
    if (this.newProduct.designation === null ||
      this.newProduct.price === null
      || this.newProduct.quantity === null) {
      return true;
    }
    return false
  }

  /**
   * To add the new product
   */
  addNewProduct(): void {
    const product : Product = JSON.parse(JSON.stringify(this.newProduct));
    this.invoice.productList.push(product);
    this.newProduct.designation = null;
    this.newProduct.price = null;
    this.newProduct.quantity = null;
    this.calculateNewTotal();
  }

  /**
   * To calculate the new total, updates the date of the invoice
   */
  calculateNewTotal(): void {
    this.invoice.total = this.invoice.productList.reduce( (total,product) => {
      return total + product.price * product.quantity;
    },0);
    this.invoice.date = moment();
  }

  /**
   * To delete a product from the invoice
   * @param product the product to delete
   */
  deleteProduct(product: Product): void {
    this.invoice.productList.splice(this.invoice.productList.findIndex(productToFind => productToFind === product),1);
    this.calculateNewTotal();
  }
}
