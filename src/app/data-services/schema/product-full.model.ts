import {SubCategoryModel} from './sub-category.model';
import {ProductDetailModel} from './product-detail.model';

export class ProductFullModel {
  public id: string;
  public name: string;
  public quantity: number;
  public description: string;
  public imageUrl: string;
  public imageByte: string;
  public sellingPrice: number;
  public subCategory: SubCategoryModel;
  public productDetails: ProductDetailModel[] = [];

  public constructor(
    data?: ProductFullModel
  ) {
    const product = data == null ? this : data;

    this.id = product.id;
    this.name = product.name;
    this.quantity = product.quantity;
    this.description = product.description;
    this.imageUrl = product.imageUrl;
    this.imageByte = product.imageByte;
    this.sellingPrice = product.sellingPrice;
    this.subCategory = new SubCategoryModel(product.subCategory);
    const productDetails = product.productDetails || [];
    this.productDetails = [];
    for (const productDetail of productDetails) {
      this.productDetails.push(new ProductDetailModel(productDetail));
    }
  }
}
