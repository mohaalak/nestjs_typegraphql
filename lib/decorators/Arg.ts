import { Arg as ArgTypeGraphQL } from 'type-graphql';
import 'reflect-metadata';
import {
  DescriptionOptions,
  DecoratorTypeOptions,
  ReturnTypeFunc,
} from 'type-graphql/decorators/types';
import { getTypeDecoratorParams } from 'type-graphql/helpers/decorators';
import { PARAM_ARGS_METADATA } from './../graphql.constants';
import { assignMetadata } from './param.decorators';
import { GqlParamtype } from '../enums/gql-paramtype.enum';
import { PipeTransform } from '@nestjs/common';

export type Options = DecoratorTypeOptions &
  DescriptionOptions & { pipes: PipeTransform[] };

export function Arg(name: string, options?: Options): ParameterDecorator;
export function Arg(
  name: string,
  returnTypeFunc: ReturnTypeFunc,
  options?: Options,
): ParameterDecorator;
export function Arg(
  name: string,
  returnTypeFuncOrOptions?: any,
  maybeOptions?: Options,
): ParameterDecorator {
  const argType = ArgTypeGraphQL(name, returnTypeFuncOrOptions, maybeOptions);
  return (target, key, index) => {
    argType(target, key, index);
    const args =
      Reflect.getMetadata(PARAM_ARGS_METADATA, target.constructor, key) || {};
    const { options } = getTypeDecoratorParams(
      returnTypeFuncOrOptions,
      maybeOptions,
    );
    const paramPipes = options.pipes ? options.pipes : [];

    Reflect.defineMetadata(
      PARAM_ARGS_METADATA,
      assignMetadata(args, GqlParamtype.ARGS, index, name, ...paramPipes),
      target.constructor,
      key,
    );
  };
}
