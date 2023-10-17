interface FilterProps {
  setSearchInput: (value: string) => void;
}

export default function Filter({ setSearchInput }: FilterProps) {
  function handleInputChange(event: React.ChangeEvent<HTMLFormElement>) {
    const value = event.target.value as string;
    setSearchInput(value);
  }
  return (
    <form onChange={handleInputChange}>
      <div>
        <p>filter shown with</p>
        <input type="text" name="search" aria-label="filter the phonebook" />
      </div>
    </form>
  );
}
