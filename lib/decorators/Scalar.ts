import { ReflectMetadata } from '@nestjs/common';
import {
  SCALAR_NAME_METADATA,
  SCALAR_TYPE_METADATA,
} from '../graphql.constants';
import { ReturnTypeFunc } from 'type-graphql/decorators/types';

export function Scalar(returnTypeFunc: ReturnTypeFunc): ClassDecorator {
  return (target, key?, descriptor?) => {
    ReflectMetadata(SCALAR_TYPE_METADATA, returnTypeFunc())(
      target,
      key,
      descriptor,
    );
    ReflectMetadata(SCALAR_NAME_METADATA, name)(target, key, descriptor);
  };
}
