import { ErrorMessage } from '../types';

const Notify = ({ errorMessage }: { errorMessage: ErrorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div className="error-message">{errorMessage}</div>;
};

export { Notify };
