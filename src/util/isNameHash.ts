import { NameHash } from "../types/NameHash";

export const isNameHash = (object: NameHash): object is NameHash => `domain` in object;
