import _ from 'lodash';
import Mongoose from 'mongoose';

export const getInfo = ({
  object,
  fields,
}: {
  object: object;
  fields: string[];
}) => {
  return _.pick(object, fields);
};

export const omitInfo = ({
  object,
  fields,
}: {
  object: object;
  fields: string[];
}) => {
  return _.omit(object, fields);
};

export const isValidObjectId = (id: string): boolean => {
  return Mongoose.isValidObjectId(id);
};
