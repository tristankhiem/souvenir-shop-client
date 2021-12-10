import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {SellingOrderModel} from '../../data-services/schema/selling-order.model';
import {SellingOrderFullModel} from '../../data-services/schema/selling-order-full.model';

@Injectable({
  providedIn: 'root'
})
export class SellingOrderService extends StoreBaseService {
  public search(search: BaseSearchModel<SellingOrderModel[]>): Observable<any> {
    return this.post('/api/v1/selling-order/search', search);
  }

  public getById(id: string): Observable<any> {
    return this.get('/api/v1/selling-order/get-by-id/' + id);
  }

  public getByCustomerId(id: string): Observable<any> {
    return this.get('/api/v1/selling-order/get-by-customer-id/' + id);
  }

  public save(sellingOrder: SellingOrderFullModel): Observable<any> {
    return this.post('/api/v1/selling-order/insert', sellingOrder);
  }

  public update(sellingOrder: SellingOrderFullModel): Observable<any> {
    return this.put('/api/v1/selling-order/update', sellingOrder);
  }

  public deleteSellingOrder(id: string): Observable<any> {
    return this.delete('/api/v1/selling-order/delete/' + id);
  }

  public payment(id: string): Observable<any> {
    return this.get('/api/v1/selling-order/payment/' + id);
  }
}
