import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  initializeApp,
  cert,
  ServiceAccount,
  getApps,
} from 'firebase-admin/app';
import {
  DocumentData,
  Firestore,
  getFirestore,
} from 'firebase-admin/firestore';
import { FirestoreConfig } from '../config/firebase.config';

@Injectable()
export class FirestoreService implements OnModuleInit {
  private db: Firestore;

  async onModuleInit() {
    try {
      // Check if Firebase app is already initialized
      if (getApps().length === 0) {
        const app = initializeApp({
          credential: cert(FirestoreConfig as ServiceAccount),
        });
        this.db = getFirestore(app);
      } else {
        this.db = getFirestore();
      }
    } catch (error) {
      console.error('Error initializing Firestore:', error);
      throw error;
    }
  }

  async create<T extends DocumentData>(
    collection: string,
    data: T,
  ): Promise<T & { id: string }> {
    const docRef = await this.db.collection(collection).add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      id: docRef.id,
      ...data,
    };
  }

  async findById<T extends DocumentData>(
    collection: string,
    id: string,
  ): Promise<(T & { id: string }) | null> {
    const docRef = await this.db.collection(collection).doc(id).get();

    if (!docRef.exists) {
      return null;
    }

    return {
      id: docRef.id,
      ...(docRef.data() as T),
    };
  }

  async findByField<T extends DocumentData>(
    collection: string,
    field: string,
    value: any,
  ): Promise<(T & { id: string }) | null> {
    const querySnapshot = await this.db
      .collection(collection)
      .where(field, '==', value)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...(doc.data() as T),
    };
  }

  async findAll<T extends DocumentData>(
    collection: string,
  ): Promise<(T & { id: string })[]> {
    const querySnapshot = await this.db.collection(collection).get();
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as T),
    }));
  }
}
