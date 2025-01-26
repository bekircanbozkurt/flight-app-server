import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DatabaseService } from '../database/database.interface';

interface JsonData {
  [key: string]: unknown[];
}

@Injectable()
export class LocalJsonService implements DatabaseService {
  private readonly dataPath = path.join(process.cwd());

  async readCollection<T>(collectionName: string): Promise<T[]> {
    try {
      const filePath = path.join(this.dataPath, `${collectionName}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(data) as JsonData;
      return jsonData[collectionName] as T[];
    } catch (error) {
      console.error(`Error reading ${collectionName}:`, error);
      return [];
    }
  }

  async findOne<T>(
    collectionName: string,
    predicate: (item: T) => boolean,
  ): Promise<T | null> {
    const items = await this.readCollection<T>(collectionName);
    return items.find(predicate) || null;
  }

  async findMany<T>(
    collectionName: string,
    predicate: (item: T) => boolean,
  ): Promise<T[]> {
    const items = await this.readCollection<T>(collectionName);
    return items.filter(predicate);
  }

  async create<T>(collectionName: string, newItem: T): Promise<T> {
    const items = await this.readCollection<T>(collectionName);
    items.push(newItem);
    await this.writeCollection(collectionName, items);
    return newItem;
  }

  async update<T>(
    collectionName: string,
    predicate: (item: T) => boolean,
    updateData: Partial<T>,
  ): Promise<T | null> {
    const items = await this.readCollection<T>(collectionName);
    const index = items.findIndex(predicate);

    if (index === -1) return null;

    items[index] = { ...items[index], ...updateData };
    await this.writeCollection(collectionName, items);
    return items[index];
  }

  async delete<T>(
    collectionName: string,
    predicate: (item: T) => boolean,
  ): Promise<boolean> {
    const items = await this.readCollection<T>(collectionName);
    const filteredItems = items.filter((item) => !predicate(item));

    if (filteredItems.length === items.length) return false;

    await this.writeCollection(collectionName, filteredItems);
    return true;
  }

  private async writeCollection<T>(
    collectionName: string,
    data: T[],
  ): Promise<void> {
    try {
      const filePath = path.join(this.dataPath, `${collectionName}.json`);
      const jsonData = { [collectionName]: data };
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.error(`Error writing to ${collectionName}:`, error);
      throw error;
    }
  }
}
