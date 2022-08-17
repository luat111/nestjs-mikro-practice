import { CreateSpecCategoryDTO } from '../dto/create-spec-category.dto';
import { UpdateSpecCategoryDTO } from '../dto/update-spec-category.dto';

export interface ISpecCategorySerivce {
  readonly serviceName: string;
  getAll();
  getOne(id: string);
  create(payload: CreateSpecCategoryDTO);
  update(payload: UpdateSpecCategoryDTO);
  remove(id: string);
}
