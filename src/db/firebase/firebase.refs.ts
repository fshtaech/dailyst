import { ref } from "firebase/database";
import { database } from "./firebase.config";
import { type DatabaseReference } from "firebase/database";

const NODES = {
  users: "users",
  journals: "journals",
  todos: "todos",
  goals: "goals",
};

export const dbRef = {
  users: (): DatabaseReference => ref(database, NODES.users),
  journals: (): DatabaseReference => ref(database, NODES.journals),
  todos: (): DatabaseReference => ref(database, NODES.todos),
  goals: (): DatabaseReference => ref(database, NODES.goals),

  user: (id: string): DatabaseReference =>
    ref(database, `${NODES.users}/${id}`),
  journal: (id: string): DatabaseReference =>
    ref(database, `${NODES.journals}/${id}`),
  todo: (id: string): DatabaseReference =>
    ref(database, `${NODES.todos}/${id}`),
  goal: (id: string): DatabaseReference =>
    ref(database, `${NODES.goals}/${id}`),
};
