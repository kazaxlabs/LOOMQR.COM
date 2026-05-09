import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
}));
