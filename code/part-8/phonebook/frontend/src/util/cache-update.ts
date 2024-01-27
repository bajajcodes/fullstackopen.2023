import { ApolloCache, DocumentNode } from '@apollo/client';
import { PersonInterface } from '../types';

const uniqByName = (array: Array<PersonInterface>) => {
  const seen = new Set();
  return array.filter((item) => {
    const k = item.name;
    return seen.has(k) ? false : seen.add(k);
  });
};

const updateCache = (
  cache: ApolloCache<object>,
  query: { query: DocumentNode },
  addedPerson: PersonInterface
) => {
  cache.updateQuery(query, ({ allPersons }) => {
    return {
      allPersons: uniqByName(allPersons.concat(addedPerson)),
    };
  });
};

export { updateCache };
