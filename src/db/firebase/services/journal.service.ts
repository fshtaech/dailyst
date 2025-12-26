import {
  equalTo,
  get,
  orderByChild,
  push,
  query,
  set,
} from "firebase/database";
import type { JournalType } from "../types/Journal";
import { dbRef } from "../firebase.refs";
import { getFirstObject } from "../../../lib/utils/get";
import { NoJournalError } from "../exceptions/NoJournalError";
import { InvalidPushError } from "../exceptions/InvalidPushError";
import { authService } from "./auth.service";

export const journalService = {
  getJournal: async (journalId: string): Promise<JournalType | null> => {
    const snap = await get(dbRef.journal(journalId));

    if (!snap) {
      throw new NoJournalError(`Journal was not found with id ${journalId}`);
    }

    return getFirstObject(snap.val()).value as JournalType;
  },

  getJournals: async (userId: string): Promise<JournalType[]> => {
    const snap = await get(
      query(dbRef.journals(), ...[orderByChild("user"), equalTo(userId)])
    );

    if (!snap) {
      throw new NoJournalError(
        `No journals were found for user with id ${userId}`
      );
    }

    const journals: JournalType[] = Object.values(snap.val()).map(
      (obj) => obj as JournalType
    );

    return journals;
  },

  createUserJournal: async (
    journal: Pick<JournalType, "title" | "content">
  ): Promise<void> => {
    const snap = await push(dbRef.journals());
    const insertJournal: JournalType = {
      id: snap.key!,
      user: authService.getAuthUser()?.uid,
      title: journal.title,
      content: journal.content,
      pinned: false,
      createdAt: new Date().toISOString(),
    };

    if (!snap) {
      throw new InvalidPushError("Unable to push empty journal");
    }

    await set(dbRef.journal(snap.key!), insertJournal);
  },
};
