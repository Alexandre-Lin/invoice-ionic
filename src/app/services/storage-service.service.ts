import {Injectable} from '@angular/core';

import {Storage} from '@ionic/storage-angular';

import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import {BehaviorSubject} from 'rxjs';
import {Invoice} from '../shared/model/invoice';
import {InvoiceItem} from '../shared/model/invoice-item';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  /**
   * For detecting changes
   */
  $detectChanges: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private mainStorage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    await this.storage.defineDriver(CordovaSQLiteDriver);
    const storage = await this.storage.create();
    this.mainStorage = storage;
    this.$detectChanges.next(!this.$detectChanges.value);
  }

  /**
   * To save an invoice
   *
   * @param invoice the invoice to save
   */
  public async save(invoice: Invoice): Promise<string> {
    const keys = await this.mainStorage?.keys();
    if (keys.length === 0) {
      await this.set('1', JSON.stringify(invoice));
      return '1';
    } else {
      const maxKey = Math.max.apply(Math, keys.map((key) => +key));
      await this.set((maxKey + 1).toString(), JSON.stringify(invoice));
      return (maxKey + 1).toString();
    }
  }

  /**
   * Gives the new Invoice Number, if a new year has started,
   * then the count will fallback to 1
   */
  public async getNewInvoiceNumber(): Promise<number> {
    const keys = await this.mainStorage?.keys();
    let newNumber = 1;
    if (keys.length !== 0) {
      // get last invoice
      const maxKey = Math.max.apply(Math, keys.map((key) => +key));
      const lastInvoice: Invoice = JSON.parse(await this.getFromKey(maxKey.toString()));

      // check if new year or not
      if (moment(lastInvoice.date).year() !== moment().year()) {
        newNumber = 1;
      } else {
        newNumber = lastInvoice.invoiceNumber + 1;
      }
      return newNumber;
    }
  }

  /**
   * To get invoice from the selected key
   *
   * @param key the selected key
   */
  public async getFromKey(key: string): Promise<string> {
    return await this.mainStorage?.get(key);
  }

  public async getAllInvoices(): Promise<InvoiceItem[]> {
    const invoices: InvoiceItem[] = [];
    await this.mainStorage?.forEach((value, key, index) => {
      const invoice: Invoice = JSON.parse(value);
      invoices.push({
        keyStoredId: key,
        invoiceNumber: invoice.invoiceNumber,
        companyAddress: invoice.companyAddress,
        companyName: invoice.companyName,
        date: invoice.date,
        total: invoice.total,
        tax: invoice.tax,
        productList: invoice.productList,
        paymentMode: invoice.paymentMode,
        customerAdress: invoice.customerAdress,
        customerName: invoice.customerName
      });
    });
    return invoices;
  }

  /**
   * For detecting changes from the list
   *
   * @returns a behavior subject to detect changes
   */
  observeChanges(): BehaviorSubject<boolean> {
    return this.$detectChanges;
  }

  /**
   * To remove a given invoice
   */
  async deleteFromKey(key: string) {
    await this.mainStorage?.remove(key);
    this.$detectChanges.next(!this.$detectChanges.value);
  }

  private async set(key: string, value: any) {
    await this.mainStorage?.set(key, value);
    this.$detectChanges.next(!this.$detectChanges.value);
  }
}
