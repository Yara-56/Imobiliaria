export type PropertyDocument = {
  id: string;
  name: string;
  url: string;        // ou path
  createdAt?: string;
};

export type Property = {
  id: string;

  cep: string;
  sqls: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;

  documents?: PropertyDocument[]; // lista de anexos já salvos no backend

  createdAt?: string;
  updatedAt?: string;
};

// Para criar (normalmente sem id e sem documents prontos)
export type CreatePropertyDTO = {
  cep: string;
  sqls: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
};

// Para editar (muitas vezes parcial)
export type UpdatePropertyDTO = Partial<CreatePropertyDTO>;
