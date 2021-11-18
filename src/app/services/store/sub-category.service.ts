import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {SubCategoryModel} from '../../data-services/schema/sub-category.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService extends StoreBaseService {
  public search(search: BaseSearchModel<SubCategoryModel[]>): Observable<any> {
    return this.post('/api/v1/subcategory/search', search);
  }

  public getLikeName(name: string): Observable<any> {
    return this.get('/api/v1/subcategory/get-like-name/' + name);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/v1/subcategory/' + id);
  }

  public save(subCategory: SubCategoryModel): Observable<any> {
    return this.post('/api/v1/subcategory/insert', subCategory);
  }

  public update(subCategory: SubCategoryModel): Observable<any> {
    return this.put('/api/v1/subcategory/update', subCategory);
  }

  public deleteSubCategory(id: number): Observable<any> {
    return this.delete('/api/v1/subcategory/delete/' + id);
  }
}
