export interface PersonInterface {
  id: string;
  name: string;
  phone?: string;
  address: {
    street: string;
    city: string;
  };
}

export type ErrorMessage = string | null;
export type Token = string | null;
