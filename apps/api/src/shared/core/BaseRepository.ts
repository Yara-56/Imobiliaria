export interface BaseRepository<T, CreateDTO, UpdateDTO> {
    create(data: CreateDTO): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(filters?: any): Promise<T[]>;
    update(id: string, data: UpdateDTO): Promise<T>;
    delete(id: string): Promise<void>;
  }