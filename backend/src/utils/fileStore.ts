import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: number;
  avatar?: string;
}

interface DataStore {
  users: User[];
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore(): DataStore {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    return { users: [] };
  }
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw) as DataStore;
  } catch {
    return { users: [] };
  }
}

function writeStore(data: DataStore): void {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const userStore = {
  findByEmail(email: string): User | undefined {
    return readStore().users.find(
      (u) => u.email === email.toLowerCase().trim()
    );
  },

  findById(id: string): User | undefined {
    return readStore().users.find((u) => u.id === id);
  },

  create(data: Omit<User, "id" | "createdAt">): User {
    const store = readStore();
    const newUser: User = {
      ...data,
      email: data.email.toLowerCase().trim(),
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: Date.now(),
    };
    store.users.push(newUser);
    writeStore(store);
    return newUser;
  },

  count(): number {
    return readStore().users.length;
  },
};
