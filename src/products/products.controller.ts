import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces';

import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities';

@ApiTags('products')
@Controller('products')
@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiResponse({status: 201, description: 'The record has been successfully created.', type: Product})
  @ApiResponse({status: 400, description: 'Bad Request.'})
  @ApiResponse({status: 403, description: 'Forbidden. Token related.'})


    create(
      @Body() createProductDto: CreateProductDto,
      @GetUser() user: User
      ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    // console.log(paginationDto)
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  //el parametro id debe ser un uuid
  findOne(
        
    @Param('term' ) term: string) {
    return this.productsService.findOnePlain( term );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
    ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
