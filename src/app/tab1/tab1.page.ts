import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {StorageServiceService} from '../services/storage-service.service';
import {InvoiceItem} from '../shared/model/invoice-item';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  invoices: InvoiceItem[] = [];

  constructor(private storageService: StorageServiceService, private translateService: TranslateService,
              private router: Router, private alertController: AlertController) {
  }

  ngOnInit(): void {
    this.storageService.observeChanges().subscribe(() => {
      this.storageService.getAllInvoices().then(invoices => {
        if (invoices) {
          invoices = invoices.sort((a, b) => moment(b.date).diff(a.date));
          invoices = invoices.map(invoice => {
            invoice.date = moment(invoice.date);
            if (invoice.paymentMode) {
              invoice.paymentMode = this.translateService.instant(invoice.paymentMode);
            }
            return invoice;
          });
          this.invoices = invoices;
        }
      });
    });
  }

  /**
   * redirect to preview page
   *
   * @param key the key stored in locale storage
   */
  previewInvoice(key: string): void {
    this.router.navigate(['./preview-print', key]);
  }

  /**
   * delete the given invoice
   *
   * @param key the key stored in locale storage
   */
  async deleteInvoice(key: string) {
    const alert = await this.alertController.create({
      message: this.translateService.instant('DELETE'),
      buttons: [
        {
          text: this.translateService.instant('CANCEL'),
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: this.translateService.instant('YES'),
          handler: () => {
            this.storageService.deleteFromKey(key);
          }
        }
      ]
    });
    await alert.present();
  }
}
