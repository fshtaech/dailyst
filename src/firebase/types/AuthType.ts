export type AuthType = "anonymous" | "google" | "credentials" | "none";

export const authType = {
  ANONYMOUS: "anonymous" as AuthType,
  GOOGLE: "google" as AuthType,
  CREDENTIALS: "credentials" as AuthType,
  NONE: "none" as AuthType,
};
