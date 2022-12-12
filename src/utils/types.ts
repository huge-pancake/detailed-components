export type Constructor<T> = new () => T;

export type Mixin<BaseMembers, MixinMembers> = <T extends HTMLElement & BaseMembers>(
  Base: Constructor<T>
) => Constructor<T & MixinMembers>;
