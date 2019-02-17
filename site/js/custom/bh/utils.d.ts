import { Hop } from "./coordinates";
declare function validHops(): Hop[];
declare function lazily<T>(f: () => T): () => T;
export { validHops, lazily };
