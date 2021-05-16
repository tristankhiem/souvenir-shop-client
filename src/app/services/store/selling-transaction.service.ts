import {Injectable} from '@angular/core';
import {StoreBaseService} from '../generic/store-base.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SellingTransactionService extends StoreBaseService{
  public getByOrderId(id: number): Observable<any> {
    return this.get('/api/selllingorder/get-transaction-by-order-id' + id);
  }

}
