import {Component, ElementRef, OnInit} from '@angular/core';
import {AppAlert, AppLoading} from '../../utils';
import {ProductService} from '../../services/store/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../services/store/category.service';
import {ProductModel} from '../../data-services/schema/product.model';
import {Options} from '@angular-slider/ngx-slider';
import {SubCategoryModel} from '../../data-services/schema/sub-category.model';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {CategoryModel} from '../../data-services/schema/category.model';

@Component({
  selector: 'app-category-product-list',
  templateUrl: './category-product-list.component.html',
})

export class CategoryProductListComponent implements OnInit{
    constructor(
        private root: ElementRef,
        private loading: AppLoading,
        private alert: AppAlert,
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router,
        private categoryService: CategoryService
    ) {
        route.params.subscribe(val => {
          this.onInit();
        });
    }

    public title = '';
    public productList: ProductModel[] = [];
    public categoryId: string;
    public p = 1; // current page for pagination
    public collection = [];
    public minValue = 0;
    public maxValue = 500000;
    public options: Options = {
      floor: 0,
      ceil: 500000,
      translate: (value: number): string => {
        return value + 'đ';
      },
      combineLabels: (minValue: string, maxValue: string): string => {
        return 'from ' + minValue + ' to ' + maxValue;
      }
    };
    public subCategoryList: SubCategoryModel[] = [];

    ngOnInit(): void {
        this.onInit();
    }

    public onInit(): void{
        this.categoryId = this.route.snapshot.params.categoryId;
        this.productList = [];
        this.getProductList();
        this.getSubcategories();
        this.getCategoryName();
    }

    private getProductList(): void{
        this.loading.show();
        // this.search.recordOfPage = 8;
        this.productService.getListByCategory(this.categoryId).subscribe(res => this.getProductListCompleted(res));
    }

    private getProductListCompleted(res: ResponseModel<ProductModel[]>): void{
        this.collection = [];
        this.loading.hide();
        if (res.status !== HTTP_CODE_CONSTANT.OK) {
            this.alert.errorMessages(res.message);
        }

        this.productList = res.result;

        for ( const e of this.productList){
          e.imageUrl = 'data:image/jpeg;base64,' + e.imageByte;
          this.collection.push(e);
        }
    }

    // public openDetail(event: Event): void{
    //
    // }

    public priceFilter(min: number, max: number): void {
        this.collection = [];
        for ( const e of this.productList){
            if (e.sellingPrice >= min && e.sellingPrice <= max){
              this.collection.push(e);
            }
        }
    }

    public getSubcategories(): void{
        this.categoryService.getSubcategoriesByCategory(this.categoryId).subscribe(res => this.getSubcategoriesCompleted(res));
    }

    private getSubcategoriesCompleted(res: ResponseModel<SubCategoryModel[]>): void {
        if (res.status !== HTTP_CODE_CONSTANT.OK) {
            this.alert.errorMessages(res.message);
        }

        this.subCategoryList = res.result;

    }

    private getCategoryName(): void{
      this.categoryService.getById(this.categoryId).subscribe(res => this.getCategoryNameCompleted(res));
    }

    private getCategoryNameCompleted(res: ResponseModel<CategoryModel>): void {
      if (res.status !== HTTP_CODE_CONSTANT.OK){
          this.alert.errorMessages(res.message);
      }

      this.title = res.result.name;
    }

}
