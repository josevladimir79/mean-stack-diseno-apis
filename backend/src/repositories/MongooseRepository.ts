import type { HydratedDocument, Model, QueryFilter } from "mongoose";
import type { IRepository } from "./IRepository.ts";

export class MongooseRepository<T> implements IRepository<T> {
  private readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async getBy<K extends keyof T>(field: K, value: T[K]): Promise<T | null> {
    return await this.model.findOne({ [field]: value } as QueryFilter<T>);
  }

  async create(entity: T): Promise<T> {
    const nuevo: HydratedDocument<T> = new this.model(entity);
    await nuevo.save();
    return nuevo;
  }

  async update(id: string, entity: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, entity, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }
}
