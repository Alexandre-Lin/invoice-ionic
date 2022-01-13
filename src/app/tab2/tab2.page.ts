import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {ProductConfigService} from '../services/product-config.service';
import {StorageServiceService} from '../services/storage-service.service';
import {Invoice} from '../shared/model/invoice';
import {Product} from '../shared/model/product';
import {ProductNames} from '../shared/model/product-names';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  /**
   * List of all products name loaded from the ProductConfigService
   */
  productListNames: ProductNames[] = [];

  invoice: Invoice = {
    date: moment(),
    productList: [],
    tax: 20,
    total: 0,
    paymentMode: '1.CB',
    customerName: null,
    customerAdress: null
  };

  newProduct: Product = {
    designation: null,
    price: null,
    quantity: null
  };

  constructor(private productConfigService: ProductConfigService, private translateService: TranslateService,
              private alertController: AlertController, private storageService: StorageServiceService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.productListNames = this.productConfigService.getProductNameList();
    this.invoice.tax = this.productConfigService.getTaxPercentage();
    this.productConfigService.observeChanges().subscribe(() => {
      this.productListNames = this.productConfigService.getProductNameList();
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
    }
  };

  /**
   * To input new value for product designation
   */
  async inputCustomSelectValue() {
    const alert = await this.alertController.create({
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
    return this.newProduct.designation === null ||
      this.newProduct.price === null
      || this.newProduct.quantity === null;
  }

  /**
   * To add the new product
   */
  addNewProduct(): void {
    const product: Product = JSON.parse(JSON.stringify(this.newProduct));
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
    this.invoice.total = this.invoice.productList.reduce((total, product) => total + product.price * product.quantity, 0);
    this.invoice.date = moment();
  }

  /**
   * To delete a product from the invoice
   *
   * @param product the product to delete
   */
  deleteProduct(product: Product): void {
    this.invoice.productList.splice(this.invoice.productList.findIndex(productToFind => productToFind === product), 1);
    this.calculateNewTotal();
  }

  /**
   * To activate the printing process (
   * process: saving invoice after converting all data to french, passing to the router to access the visualize
   * and print page)
   */
  print(): void {
    // conversion to french data
    const productList: Product[] = [];
    this.invoice.productList.forEach((product: Product) => {
      const index = this.productListNames.findIndex((prod) => prod.translatedLabel === product.designation);
      if (index > -1) {
        productList.push({
          designation: this.productListNames[index].frLabel,
          price: product.price,
          quantity: product.quantity
        });
      } else {
        productList.push(product);
      }
    });
    this.invoice.productList = productList;

    // paymentMode conversion
    if (this.invoice.paymentMode.includes('1')) {
      this.invoice.paymentMode = 'CB';
    }
    if (this.invoice.paymentMode.includes('2')) {
      this.invoice.paymentMode = 'CASH';
    }
    if (this.invoice.paymentMode.includes('3')) {
      this.invoice.paymentMode = 'CHECK_PAYMENT';
    }


    // saving in locale storage
    const invoiceToSave: Invoice = JSON.parse(JSON.stringify(this.invoice));
    const key = this.storageService.save(invoiceToSave);

    //cleaning the page
    this.invoice.date = moment();
    this.invoice.productList = [];
    this.invoice.tax = this.productConfigService.getTaxPercentage();
    this.invoice.total = 0;
    this.invoice.customerName = null;
    this.invoice.customerAdress = null;
    this.invoice.paymentMode = '1.CB';
    this.newProduct.quantity = null;
    this.newProduct.designation = null;
    this.newProduct.price = null;

    // redirecting
    key.then(key1 => {
      this.router.navigate(['/preview-print', key1]);
    });
  }
}
