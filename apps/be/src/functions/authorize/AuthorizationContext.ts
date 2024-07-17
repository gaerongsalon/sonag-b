export default interface AuthorizationContext {
  seq: number | null;
  email: string | null;
  name: string | null;
}

export const nullAuthorizationContext: AuthorizationContext = {
  seq: null,
  email: null,
  name: null,
};
