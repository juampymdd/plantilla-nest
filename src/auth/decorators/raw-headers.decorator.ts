import { ExecutionContext, createParamDecorator, InternalServerErrorException } from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const headers =  req.rawHeaders;

  if( !headers ){
    throw new InternalServerErrorException('No se han encontrado los headers');
  }

  return (!data ) ? headers : headers[data];
})