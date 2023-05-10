import { IsIn, IsArray, IsString,MinLength, IsNumber, 
    IsPositive, IsInt, IsOptional   } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {

    @ApiProperty({
      description: 'Product Title (unique)',
      nullable: false,
      minLength: 1,
    })
    @IsString()
    @MinLength(1)
    title: string;
    
    @ApiProperty({
      description: 'Product Title (unique)',
      nullable: false,
      minLength: 1,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
    
    @ApiProperty({
      description: 'Product Title (unique)',
      nullable: false,
      minLength: 1,
    })
    @IsString()
    @IsOptional()
    description?: string;
    
    @ApiProperty({
      description: 'Product Title (unique)',
      nullable: false,
      minLength: 1,
    })
    @IsString()
    @IsOptional()
    slug?: string;
    
    @ApiProperty({
      description: 'Product Title (unique)',
      nullable: false,
      minLength: 1,
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;
    
    @ApiProperty({
      description: 'Product Title (unique)',
      nullable: false,
      minLength: 1,
    })
    @IsString({each: true})
    @IsArray()
    sizes: string[];

    @IsIn(['men', 'women', 'kids', 'unisex'])
    gender: string;

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    images?: string[];
}
