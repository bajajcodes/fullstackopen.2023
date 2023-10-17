interface PersonFormProps {
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function PersonForm(props: PersonFormProps) {
  return (
    <form onSubmit={props.handleFormSubmit}>
      <div>
        name:{" "}
        <input
          type="text"
          aria-label="input-text-for-phoneboook"
          name="name"
          required
        />
      </div>{" "}
      <div>
        number:{" "}
        <input
          type="text"
          aria-label="input-text-for-phoneboook"
          name="number"
          required
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}
