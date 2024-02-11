import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { ProductImage } from "./";
import { User } from "src/auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {

    private checkSlug = () => {

        this.slug = this.slug 
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'",'');
    }

    @ApiProperty({
        example: 'ad38721d-0631-48f6-a1fa-f3fb0ada82ff',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty(
        {
            example: 'T-Shirt Teslo',
            description: 'Product Title',
            uniqueItems: true
        }
    )
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty(
        {
            example: 0,
            description: 'Product price',
        }
    )
    @Column('float',{
        default: 0
    })
    price: number;

    @ApiProperty(
        {
            example: 'Sint voluptate in irure exercitation amet qui id tempor nostrud.',
            description: 'Product description',
            default: null
        }
    )
    @Column('text', {
        nullable: true
    })
    description: string;

    @ApiProperty(
        {
            example: 't_shirt_teslo',
            description: 'Product SLUG - for SEO',
            uniqueItems: true
        }
    )
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty(
        {
            example: 10,
            description: 'Product stock',
            default: 0
        }
    )
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty(
        {
            example: ['M', 'XL', 'XXL'],
            description: 'Product sizes',
        }
    )
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty(
        {
            example: 'women',
            description: 'Product gender',
        }
    )
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        ( productImage )=> productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert(){

        if(!this.slug){
            this.slug = this.title;
        }

        this.checkSlug();
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.checkSlug();
    }
}
