import type { PersonInterface } from '../types';

const Person = ({
  person,
  onClose,
}: {
  person: PersonInterface;
  onClose: () => void;
}) => {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose} type="button">
        close
      </button>
    </div>
  );
};

export { Person };
