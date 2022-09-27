import { EntityRepository, MikroORM, UseRequestContext, wrap } from '@mikro-orm/core';
import { InjectMikroORM, InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';

import BadRequest from 'src/core/exceptions/bad-request.exception';
import SpecCategoryEntity from 'src/entities/spec-category.entity';
import NotFoundRecord from '../../core/exceptions/not-found.exception';

import { LoggerService } from '../logger/logger.service';

import { CreateSpecCategoryDTO } from './dto/create-spec-category.dto';
import { UpdateSpecCategoryDTO } from './dto/update-spec-category.dto';
import {
  ISpecCategorySerivce,
  ISpecCateogry,
} from './interface/spec-category.interface';

@Injectable()
export class SpecCateService implements ISpecCategorySerivce {
  constructor(
    @Inject(LoggerService)
    private readonly logger: LoggerService,
    @InjectMikroORM('dbLocal')
    private readonly orm: MikroORM,
    @InjectRepository(SpecCategoryEntity, 'dbLocal')
    private readonly specCateRepo: EntityRepository<SpecCategoryEntity>,
  ) {
    this.logger.setContext(SpecCateService.name);
  }

  @UseRequestContext()
  async commit(payload: ISpecCateogry | ISpecCateogry[]): Promise<void> {
    await this.specCateRepo.persistAndFlush(payload);
  }

  async getAll(): Promise<ISpecCateogry[]> {
    try {
      const cates = await this.specCateRepo.findAll();
      return cates;
    } catch (err) {
      this.logger.error(err.response.message || err.message);
      throw new BadRequest(SpecCateService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getOne(id: string): Promise<ISpecCateogry> {
    try {
      const cate = await this.specCateRepo.findOne(
        {
          id,
        },
        {
          populate: ['specs', 'products'],
        },
      );

      if (!cate) throw new NotFoundRecord(id);

      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecCateService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async create(payload: CreateSpecCategoryDTO): Promise<ISpecCateogry> {
    try {
      const cate = this.specCateRepo.create(payload);
      await this.commit(cate);
      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecCateService.name, err);
    }
  }

  async update(payload: UpdateSpecCategoryDTO): Promise<ISpecCateogry> {
    try {
      const { id, ...rest } = payload;
      const cate = await this.getOne(id);

      const updatedCate = wrap(cate).assign({
        ...rest,
      });

      await this.commit(cate);
      return updatedCate;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecCateService.name, err);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const cate = await this.getOne(id);
      await this.specCateRepo.removeAndFlush(cate);
      return 'Delete successed';
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecCateService.name, err);
    }
  }
}
