import _ from 'lodash';

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
