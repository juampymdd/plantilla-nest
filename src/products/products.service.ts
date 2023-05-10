import { NotFoundException } from '@nestjs/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ){}
  async create(createProductDto: CreateProductDto, user: User) {
    try{
      const { images = [], ...productDEtails } = createProductDto;
      const product = this.productsRepository.create({
        ...productDEtails,
        images: images.map( image => this.productImageRepository.create({url: image}) ),
        user
      });
      await this.productsRepository.save(product);

      return { ...product, images:images};

    }catch(err){
      this.handleDBExceptions(err); 
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const { limit=10, offset=0 } = paginationDto;
    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return products.map(product => ({
      ...product,
      images: product.images.map( image => image.url )
    }));
  }

  async findOne( term: string ) {
    
    let product : Product;

    if ( isUUID(term) ) {
      product = await this.productsRepository.findOneBy({ id: term });
    }else {
      const queryBuilder = this.productsRepository.createQueryBuilder();

      product = await queryBuilder
              .where(
                `UPPER(title) = :title or slug = :slug`, 
                { 
                  title: term.toUpperCase(),
                  slug: term .toLowerCase()
                })
                .leftJoinAndSelect('Product.images', 'images')
                .getOne()
              
    }
    
    if(!product) throw new NotFoundException(`El producto con el termino ${term} no existe`);
    
    return product;
  }

  async findOnePlain( term: string ) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images.map( (image: { url: any; }) => image.url )
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productsRepository.preload({ id, ...toUpdate })

    if( !product ) throw new NotFoundException(`El producto con el id ${id} no existe`);

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try{
      if( images ) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        await queryRunner.manager.save(
          images.map( (url: string) => this.productImageRepository.create({ url, product }) )
        );
      }
      product.user = user
      await queryRunner.manager.save(product); // save updated product

      await queryRunner.commitTransaction(); // commit transaction now
      await queryRunner.release(); // release query runner

    }catch (err) {

      await queryRunner.rollbackTransaction(); // since we have errors lets rollback changes we made
      this.handleDBExceptions(err);
    }

    return { images, ...product };
  }

  async remove(id: string) {

    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    
  }

  private handleDBExceptions( error: any ) {
    if (error.code === '23505') 
      throw new BadRequestException(error.detail);
    
    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  async deleteAllProducts() {
    const query = this.productsRepository.createQueryBuilder('product');
    try {
      await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
