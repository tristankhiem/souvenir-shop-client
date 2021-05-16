import {Injectable} from '@angular/core';
import {StoreBaseService} from '../generic/store-base.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SellingOrderService extends StoreBaseService{
  public getById(id: number): Observable<any> {
    return this.get('/api/sellingorder/' + id);
  }

  public getByCustomerId(id: number): Observable<any> {
    return this.get('/api/sellingorder/get-by-customer-id/' + id);
  }
}
