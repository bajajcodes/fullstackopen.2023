import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/auth-context';

export function Header() {
  const { signout } = useAuthContext();
  const navigateTo = useNavigate();

  return (
    <div>
      <button onClick={() => navigateTo('authors')}>authors</button>
      <button onClick={() => navigateTo('books')}>books</button>
      <button onClick={() => navigateTo('recommendations')}>
        recommendations
      </button>
      <button onClick={() => navigateTo('add')}>add book</button>
      <button onClick={signout}>logout</button>
    </div>
  );
}
