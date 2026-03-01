import { BaseRepository } from "../../../shared/base/base.repository.js";

// Substituímos <any> por uma interface se você tiver, ou mantemos any por enquanto
export class UserRepository extends BaseRepository<any> {
  constructor() {
    super("user");
  }

  async findByEmail(email: string) {
    // Usando o getter herdado da BaseRepository
    return await this.model.findUnique({
      where: { email }
    });
  }
}