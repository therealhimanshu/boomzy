/**
 * In-Memory Mock Firestore Database
 * 
 * Implements a lightweight mock of Firestore collections, queries, and documents
 * for local development and verification when Java JRE is not available to run the emulators.
 */

export const MockFieldValue = {
  serverTimestamp: () => ({ isTimestamp: true }),
};

class DocumentSnapshot {
  constructor(public id: string, public exists: boolean, private docData?: any) {}

  data() {
    if (!this.docData) return undefined;
    const { id, ...rest } = this.docData;
    return rest;
  }
}

class QuerySnapshot {
  public empty: boolean;
  public size: number;

  constructor(public docs: DocumentSnapshot[]) {
    this.empty = docs.length === 0;
    this.size = docs.length;
  }
}

class DocumentReference {
  constructor(
    private collectionName: string,
    private id: string,
    private store: Record<string, any[]>
  ) {}

  async get(): Promise<DocumentSnapshot> {
    const docs = this.store[this.collectionName] || [];
    const doc = docs.find((d) => d.id === this.id);
    return new DocumentSnapshot(this.id, !!doc, doc);
  }

  async update(data: any): Promise<void> {
    const docs = this.store[this.collectionName] || [];
    const index = docs.findIndex((d) => d.id === this.id);
    if (index !== -1) {
      const resolvedData = { ...data };
      for (const key of Object.keys(resolvedData)) {
        if (resolvedData[key] && typeof resolvedData[key] === 'object' && resolvedData[key].isTimestamp) {
          resolvedData[key] = new Date().toISOString();
        }
      }
      docs[index] = { ...docs[index], ...resolvedData };
    }
  }

  async delete(): Promise<void> {
    if (this.store[this.collectionName]) {
      this.store[this.collectionName] = this.store[this.collectionName].filter(
        (d) => d.id !== this.id
      );
    }
  }
}

class Query {
  constructor(
    private collectionName: string,
    private docs: any[],
    private filters: any[] = [],
    private orders: any[] = [],
    private limitNum: number = Infinity
  ) {}

  where(field: string, op: string, value: any): Query {
    return new Query(
      this.collectionName,
      this.docs,
      [...this.filters, { field, op, value }],
      this.orders,
      this.limitNum
    );
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): Query {
    return new Query(
      this.collectionName,
      this.docs,
      this.filters,
      [...this.orders, { field, direction }],
      this.limitNum
    );
  }

  limit(n: number): Query {
    return new Query(
      this.collectionName,
      this.docs,
      this.filters,
      this.orders,
      n
    );
  }

  async get(): Promise<QuerySnapshot> {
    let results = [...this.docs];

    // Apply filters
    for (const filter of this.filters) {
      results = results.filter((doc) => {
        const val = doc[filter.field];
        if (filter.op === '==') return val === filter.value;
        if (filter.op === '>=') {
          const valDate = val instanceof Date ? val.getTime() : new Date(val).getTime();
          const filterDate = filter.value instanceof Date ? filter.value.getTime() : new Date(filter.value).getTime();
          return valDate >= filterDate;
        }
        if (filter.op === '<=') {
          const valDate = val instanceof Date ? val.getTime() : new Date(val).getTime();
          const filterDate = filter.value instanceof Date ? filter.value.getTime() : new Date(filter.value).getTime();
          return valDate <= filterDate;
        }
        return true;
      });
    }

    // Apply sorting
    for (const order of this.orders) {
      results.sort((a, b) => {
        const valA = a[order.field];
        const valB = b[order.field];
        if (valA < valB) return order.direction === 'asc' ? -1 : 1;
        if (valA > valB) return order.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply limit
    if (results.length > this.limitNum) {
      results = results.slice(0, this.limitNum);
    }

    const docSnapshots = results.map(
      (data) => new DocumentSnapshot(data.id, true, data)
    );

    return new QuerySnapshot(docSnapshots);
  }
}

class CollectionReference {
  constructor(
    private collectionName: string,
    private store: Record<string, any[]>
  ) {
    if (!this.store[collectionName]) {
      this.store[collectionName] = [];
    }
  }

  where(field: string, op: string, value: any): Query {
    return new Query(this.collectionName, this.store[this.collectionName]).where(
      field,
      op,
      value
    );
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): Query {
    return new Query(this.collectionName, this.store[this.collectionName]).orderBy(
      field,
      direction
    );
  }

  limit(n: number): Query {
    return new Query(this.collectionName, this.store[this.collectionName]).limit(n);
  }

  async get(): Promise<QuerySnapshot> {
    return new Query(this.collectionName, this.store[this.collectionName]).get();
  }

  async add(data: any): Promise<{ id: string }> {
    const id = 'mock_doc_' + Math.random().toString(36).substring(2, 11);
    const resolvedData = { ...data };
    for (const key of Object.keys(resolvedData)) {
      if (resolvedData[key] && typeof resolvedData[key] === 'object' && resolvedData[key].isTimestamp) {
        resolvedData[key] = new Date().toISOString();
      }
    }
    this.store[this.collectionName].push({ id, ...resolvedData });
    return { id };
  }

  doc(id: string): DocumentReference {
    return new DocumentReference(this.collectionName, id, this.store);
  }
}

export class MockFirestore {
  private store: Record<string, any[]> = {
    leads: [],
    newsletter: [],
    analytics: [],
  };

  collection(name: string): CollectionReference {
    return new CollectionReference(name, this.store);
  }
}

export function createMockFirestore() {
  return new MockFirestore();
}
