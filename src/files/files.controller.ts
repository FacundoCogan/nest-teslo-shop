import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

import { fileNamer, fileFilter } from './helpers';


@Controller('files')
export class FilesController {
  constructor(
      private readonly filesService: FilesService,
      private readonly configService: ConfigService
    ) {}

  @Get('product/:imageName')
  findProductImage(
      @Res() res:Response, // al usar este deco, yo manualmente emito la respuesta
      @Param('imageName') imageName: string
    ) {

    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile( path ); // emito la respuesta
  }


  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: {fileSize: 1000}
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadProductImage(@UploadedFile() file: Express.Multer.File ){

    if( !file ) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;

    return { secureUrl };
  }


}