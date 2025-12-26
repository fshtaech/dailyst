import { useEffect, useState, type JSX } from "react";
import { JournalEditor } from "../components/JournalEditor";
import JournalLogo from "/assets/journal-new.svg";
import { journalService } from "../db/firebase/services/journal.service";
import { useAuthContext } from "../db/firebase/contexts/AuthContext";
import type { JournalType } from "../db/firebase/types/Journal";
import { JournalPaper } from "../components/JournalPaper";

export const Journals = (): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [journalListPinned, setJournalListPinned] = useState<boolean>(false);
  const [buttonSpin, setButtonSpin] = useState<boolean>(false);
  const [journals, setJournals] = useState<JournalType[] | []>([]);
  const [pinnedJournals, setPinnedJournals] = useState<JournalType[] | []>([]);

  const switchJournalList = () => {
    setButtonSpin(true);
    setJournalListPinned(!journalListPinned);

    setTimeout(() => {
      setButtonSpin(false);
    }, 400);
  };

  useEffect(() => {
    const getUserJournals = async () => {
      try {
        const data = await journalService.getJournals(currentUser!.id);
        setJournals(data);
        setPinnedJournals(data.filter((journal) => journal.pinned));
      } catch {
        setJournals([]);
      }
    };

    if (currentUser) getUserJournals();
  }, [currentUser]);

  return (
    <div className="page">
      <div className="relative flex items-center h-34 p-4 bg-primary-200/70">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[.5px]"
          style={{
            backgroundImage: `url(/images/wall-1.png)`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative">
          <img src={JournalLogo} className="w-80" />
        </div>
      </div>
      <div className="flex-1 p-2 grid grid-cols-7 gap-x-2">
        <div className="flex col-span-4">
          <JournalEditor />
        </div>
        <div className="flex  flex-col col-span-3">
          <div className="flex flex-col">
            <div className="relative flex justify-between items-center px-4  rounded-md border-2 text-accent-600 border-text-900 bg-accent-200">
              <span
                className={`flex items-center gap-2 ${
                  journalListPinned
                    ? "animate-slide-out-400"
                    : "animate-slide-in-400"
                }`}
              >
                {journalListPinned ? (
                  <>
                    <i className="di di-pin text-3xl"></i>
                    <h2 className="text-xl font-medium">
                      Your Pinned Journals
                    </h2>
                  </>
                ) : (
                  <>
                    <i className="di di-plume-ink text-3xl"></i>
                    <h2 className="text-xl font-medium">Your Journals</h2>
                  </>
                )}
              </span>

              <button
                title={
                  journalListPinned
                    ? "Switch to Journals"
                    : "Switch to Pinned Journals"
                }
                onClick={() => switchJournalList()}
                className="left-full right-4 py-1 px-2 flex items-center rounded-md cursor-pointer hover:bg-accent-400 hover:text-text-50 transition-colors duration-200"
              >
                <i
                  className={`di di-shuffle text-xl ${
                    buttonSpin && "animate-spin-400"
                  } font-bold`}
                ></i>
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {(!journalListPinned ? journals : pinnedJournals).map(
                (journal, index) => {
                  return (
                    <JournalPaper
                      key={journal.id + "-idx-" + index}
                      journal={journal}
                    />
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
