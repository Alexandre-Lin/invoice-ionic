import {Component, OnInit} from '@angular/core';
import {ProductConfigService} from '../services/product-config.service';
import {File} from '@ionic-native/file/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {StorageServiceService} from '../services/storage-service.service';
import {DocumentPicker} from '@ionic-native/document-picker/ngx';
import {InvoiceItem} from '../shared/model/invoice-item';
import {TextStorageService} from '../services/text-storage.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  taxValue = 0;

  timeNow = null;

  jsonData = null;

  constructor(private productConfigService: ProductConfigService,
              private storageService: StorageServiceService,
              private transfer: FileTransfer,
              private file: File,
              private docPicker: DocumentPicker,
              private textStorage: TextStorageService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.taxValue = this.productConfigService.getTaxPercentage();
  }

  changeTax() {
    this.productConfigService.setTaxPercentage(this.taxValue);
  }

  /**
   * Get the data stored in the app in JSON
   */
  getJSON() {
    this.storageService.getAllInvoices().then(invoices => {
      this.textStorage.store(JSON.stringify(invoices));
      this.router.navigate(['text-view']);
    });
  }

  /**
   * Save data (JSON format) in the device
   */
  saveJSON(): void {
    const invoices: InvoiceItem[] = JSON.parse(this.jsonData);
    invoices.forEach((invoice) => {
      this.storageService.save({
        date: invoice.date,
        invoiceNumber: invoice.invoiceNumber,
        companyAddress: invoice.companyAddress,
        companyName: invoice.companyName,
        productList: invoice.productList,
        paymentMode: invoice.paymentMode,
        tax: invoice.tax,
        total: invoice.total,
        customerAdress: invoice.customerAdress,
        customerName: invoice.customerName
      });
    });
    this.jsonData = null;
  }
}
