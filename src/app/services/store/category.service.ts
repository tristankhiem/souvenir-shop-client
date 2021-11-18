import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {CategoryModel} from '../../data-services/schema/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends StoreBaseService {
  public getAll(): Observable<any> {
    return this.get('/api/v1/category');
  }

  public search(search: BaseSearchModel<CategoryModel[]>): Observable<any> {
    return this.post('/api/v1/category/search', search);
  }

  public getLikeName(name: string): Observable<any> {
    return this.get('/api/v1/category/get-like-name', {name});
  }

  public getById(id: string): Observable<any> {
    return this.get('/api/v1/category/get-by-id/' + id);
  }

  public save(category: CategoryModel): Observable<any> {
    return this.post('/api/v1/category/insert', category);
  }

  public update(category: CategoryModel): Observable<any> {
    return this.put('/api/v1/category/update', category);
  }

  public deleteCategory(id: string): Observable<any> {
    return this.delete('/api/v1/category/delete/' + id);
  }

  public getSubcategories(id: string): Observable<any> {
    return this.get('/api/v1/category/get-subcategories/' + id);
  }

  public getSubcategoriesByCategory(id: string): Observable<any> {
    return this.get('/api/v1/category/get-subcategories-by-category/' + id );
  }
}
