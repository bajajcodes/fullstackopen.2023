interface PersonsProps {
  persons: Array<{ id: string; name: string; number: string }>;
  onDelete: (id: string) => void;
}

export default function Persons(props: PersonsProps) {
  return props.persons.map((p) => (
    <section key={p.id}>
      <p>
        {" "}
        {p.name} : {p.number}
      </p>
      <button type="button" onClick={() => props.onDelete(p.id)}>
        Delete
      </button>
    </section>
  ));
}
