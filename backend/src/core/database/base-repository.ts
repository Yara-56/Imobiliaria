import { Model, FilterQuery } from "mongoose";

interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: string[];
}

export abstract class BaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>) {
    return this.model.create(data);
  }

  async findById(id: string, tenantId?: string) {
    return this.model.findOne({
      _id: id,
      ...(tenantId && { tenantId }),
    } as FilterQuery<T>);
  }

  async findAll(
    tenantId: string,
    options: PaginationOptions = {}
  ) {
    const {
      page = 1,
      limit = 10,
      search,
      searchFields = [],
    } = options;

    const filter: any = { tenantId };

    if (search && searchFields.length > 0) {
      filter.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    }

    const total = await this.model.countDocuments(filter);

    const data = await this.model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { data, total };
  }

  async update(id: string, tenantId: string, data: Partial<T>) {
    return this.model.findOneAndUpdate(
      { _id: id, tenantId },
      data,
      { new: true }
    );
  }

  async delete(id: string, tenantId: string) {
    return this.model.findOneAndDelete({ _id: id, tenantId });
  }
}