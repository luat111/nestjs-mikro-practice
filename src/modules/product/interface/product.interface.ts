import ProductEntity from 'src/entities/product.entity';
import { CreateProductDTO } from '../dto/create-product.dto';
import { GetProductDTO } from '../dto/get-product.dto';
import { UpdateProductDTO } from '../dto/update-product.dto';

export interface IProductSerivce {
  syncProduct(): Promise<IProduct[]>;
  getOne(id: string): Promise<IProduct>;
  getAll(query: GetProductDTO): Promise<IProduct[]>;
  getAllPublish(query: GetProductDTO): Promise<IProduct[]>;
  update(payload: UpdateProductDTO): Promise<IProduct>;
  create(payload: CreateProductDTO): Promise<IProduct>;
}

export type IProduct = ProductEntity;