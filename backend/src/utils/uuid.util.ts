import { v6 as uuidv6 } from 'uuid';

export function generateUUIDv6(): string {
  // uuid-with-v6 library generates UUID v6
  return uuidv6();
}
