export interface PersonInterface {
  id: string;
  name: string;
  phone?: string;
  address: {
    street: string;
    city: string;
  };
}
