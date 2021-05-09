import { Component, ElementRef, OnInit } from "@angular/core";
import { AppAlert, AppLoading } from "src/app/utils";

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html'
})

export class ProductDetailComponent implements OnInit{
    constructor(
        private root: ElementRef,
        private loading: AppLoading,
        private alert: AppAlert,
        private productDetailService
    ){

    }
    ngOnInit(): void {
       
    }

}