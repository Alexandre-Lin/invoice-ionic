import {Component, OnInit} from '@angular/core';
import {ProductConfigService} from '../services/product-config.service';
import {File, FileEntry} from '@ionic-native/file/ngx';
import * as moment from 'moment';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {StorageServiceService} from '../services/storage-service.service';
import {DocumentPicker} from '@ionic-native/document-picker/ngx';
import {InvoiceItem} from '../shared/model/invoice-item';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  taxValue = 0;

  timeNow = null;

  constructor(private productConfigService: ProductConfigService,
              private storageService: StorageServiceService,
              private transfer: FileTransfer,
              private file: File,
              private docPicker: DocumentPicker
  ) {
  }

  ngOnInit(): void {
    this.taxValue = this.productConfigService.getTaxPercentage();
  }

  changeTax() {
    this.productConfigService.setTaxPercentage(this.taxValue);
  }

  download() {
    const fileTransfer: FileTransferObject = this.transfer.create();

    let text = '';

    this.storageService.getAllInvoices().then(invoices => {
      text = JSON.stringify(invoices);
      this.timeNow = moment().format('DD-MM-YYYY-hh-mm-ss');
      this.file.checkFile(this.file.dataDirectory, this.timeNow + '.json')
        .then(doesExist => {
          console.log('doesExist : ' + doesExist);
          return this.file.writeExistingFile(this.file.dataDirectory, this.timeNow + '.json', text);
        }).catch(err => this.file.createFile(this.file.dataDirectory, this.timeNow + '.json', false)
        .then(fileEntry => this.file.writeExistingFile(this.file.dataDirectory, this.timeNow + '.json', text))
        .catch(err1 => console.log('Couldnt create file')));

      // iOS download only
      fileTransfer.download(this.file.dataDirectory + this.timeNow + '.json', this.file.documentsDirectory).then((entry) => {
      }, (error) => {
      });
    });
  }

  upload() {
    this.docPicker.getFile('all')
      .then(uri => this.file.resolveLocalFilesystemUrl(uri).then(entry => {
        (entry as FileEntry).file(file => {
          file.text().then(text => {
            const invoices: InvoiceItem[] = JSON.parse(text);
            invoices.forEach((invoice) => {
              this.storageService.save({
                date: invoice.date,
                productList: invoice.productList,
                paymentMode: invoice.paymentMode,
                tax: invoice.tax,
                total: invoice.total,
                customerAdress: invoice.customerAdress,
                customerName: invoice.customerName
              });
            });
          });
        });
      }))
      .catch(e => console.log(e));
  }
}
