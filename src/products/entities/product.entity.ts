import {Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
      example: '0266f1eb-6bd0-46bf-a1f9-666ea5a85106',
      description: 'Product ID',
      uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
      example: 'T-Shirt Teslo',
      description: 'Product Title',
      uniqueItems: true
    })
    @Column('text',{
        unique: true,
        nullable: false
    })
    title: string;

    @ApiProperty({
      example: 0,
      description: 'Product Price',
      default: 0
    })
    @Column({
        type: 'float',
        default: 0,
    })
    price: number;

    @ApiProperty({
      example: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      description: 'Product Description',
      default: null
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ApiProperty({
      example: 't_shirt_teslo',
      description: 'Product Slug for SEO',
      default: null
    })
    @Column({
        type: 'text',
        unique: true,
    })
    slug: string;

    @ApiProperty({
      example: 10,
      description: 'Product Stock',
      default: 0
    })
    @Column('int',{
        default: 0,
    })
    stock: number;

    @ApiProperty({
      example: ["S","M","L","XL"],
      description: 'Product Sizes',
    })
    @Column('text',{
        array: true,
    })
    sizes: string[];

    @ApiProperty({
      example: "women",
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text',{
        array: true,
        default: []
    })
    tags: string[];

    

    @OneToMany(
      () => ProductImage,
      (productImage) => productImage.product,
      { cascade: true, eager: true }
    )
    images?: ProductImage[];


    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user:User

    @BeforeInsert()
    checkSlugInsert(){
        if (!this.slug){
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','-')
            .replaceAll("'","");
    }

    @BeforeUpdate()
    chekSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','-')
            .replaceAll("'","");
    }
}
