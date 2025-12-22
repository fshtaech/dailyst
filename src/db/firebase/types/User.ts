import type { LocationType } from "./Location";

export type UserType = {
  id: string;
  username: string;
  email: string;
  background: string;
  location: LocationType;
  createdAt: string;
};
