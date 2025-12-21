import { useState, useEffect, type JSX, type FormEvent } from "react";
import { JournalEditor } from "../components/JournalEditor";
import { getRandomArrayItem } from "../lib/utils/get";
import { greetings } from "../assets/message/greetings";
import { useAuthContext } from "../firebase/contexts/AuthContext";
import { Popover } from "../components/Popover";
import { journalService } from "../firebase/services/journal.service";
import type { JournalType } from "../firebase/types/Journal";
import { InvalidPushError } from "../firebase/exceptions/InvalidPushError";

export const Home = (): JSX.Element => {
  const { currentUser } = useAuthContext();

  const [time, setTime] = useState<number>(new Date().getTime());
  const [greeting, setGreeting] = useState<string>(() => {
    const now = new Date();
    const hour = now.getHours();
    return hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  });
  const [greetingMessage, setGreetingMessage] = useState<string>(() => {
    const initialGreeting =
      new Date().getHours() < 12
        ? "morning"
        : new Date().getHours() < 18
        ? "afternoon"
        : "evening";
    return greetings ? getRandomArrayItem(greetings[initialGreeting]) : "";
  });
  const [journalPlaceholder, setJournalPlaceholder] = useState<string>(() => {
    return greetings ? getRandomArrayItem(greetings.journal) : "";
  });
  const [infoActive, setInfoActive] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<string>("");

  // const parseDate = (time: number): string => {
  //   return new Date(time).toLocaleDateString("en-PH", {
  //     year: "numeric",
  //     month: "long",
  //     weekday: "narrow",
  //     day: "2-digit",
  //   });
  // };

  const getGreetingMessage = (greeting: string) => {
    return (
      greetings &&
      getRandomArrayItem(
        greeting == "morning"
          ? greetings.morning
          : greeting == "afternoon"
          ? greetings.afternoon
          : greetings.evening
      )
    );
  };

  const bookmarkJournal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const journal: JournalType = {
      title: formData.get("journal-title") as string,
      content: editorContent,
    };

    journalService
      .createUserJournal(journal)
      .then(() => {
        setEditorContent("");
      })
      .catch((error) => {
        throw new InvalidPushError(
          "Unable to create new journal. Error " + error
        );
      });
  };

  useEffect(() => {
    const getGreeting = (time: number) => {
      const parseTime = new Date(time).toLocaleTimeString("en-PH", {
        hour12: true,
      });
      const splitTime: string[] = parseTime.split(":");
      const hour: number = Number(splitTime[0]);
      const meridian: string = splitTime[splitTime.length - 1]
        .split(" ")[1]
        .toLowerCase();

      return meridian == "am"
        ? "morning"
        : (hour != 12 ? hour + 12 : hour) < 18
        ? "afternoon"
        : "evening";
    };

    const interval: number = setInterval(() => {
      const now = new Date().getTime();
      setTime(now);

      const currentGreeting = getGreeting(now);
      setGreeting((prev) => {
        return prev !== currentGreeting ? currentGreeting : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, greeting]);

  useEffect(() => {
    const interval: number = setInterval(() => {
      setGreetingMessage(getGreetingMessage(greeting));
    }, 900000);

    return () => clearInterval(interval);
  }, [greeting, greetingMessage]);

  useEffect(() => {
    const interval: number = setInterval(() => {
      setJournalPlaceholder(getRandomArrayItem(greetings.journal));
    }, 900000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page p-0">
      <div className="header relative h-40 w-full p-4 flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[.5px]"
          style={{
            backgroundImage: `url(/images/wall-1.png)`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="flex w-full justify-between">
          <span className="flex flex-col z-2 text-xl text-text-200">
            <h1 className="text-3xl text-text-50">
              Good{" " + greeting}
              {currentUser ? ", " : "!"}
              {currentUser && <span>{currentUser.username}</span>}
            </h1>
            {greetingMessage}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-5 w-full h-full gap-2 p-2">
        <div className="col-span-3 flex flex-col gap-2 w-full h-full">
          <form
            onSubmit={bookmarkJournal}
            className="flex items-center text-lg py-2 px-6 border-2 bg-secondary-100 focus-within:border-accent-400"
          >
            <div className="relative flex mr-4">
              <div className="group relative">
                <button
                  className="flex items-center px-1 cursor-pointer"
                  type="button"
                  onClick={() => setInfoActive(!infoActive)}
                >
                  <i className="di di-info text-xl text-text-800"></i>
                </button>
                {!infoActive && (
                  <Popover position="bottom-middle">What's this?</Popover>
                )}
              </div>
              <span
                className={`absolute -left-100 text-accent-400 whitespace-nowrap transition-all duration-500 ${
                  infoActive
                    ? "ease-out translate-x-112 opacity-100"
                    : "-translate-x-112 opacity-0 ease-in"
                }`}
              >
                Add your journal title here!
              </span>
            </div>
            <input
              type="text"
              name="journal-title"
              id="journal-title"
              placeholder={
                !infoActive
                  ? `https://${journalPlaceholder
                      .toLowerCase()
                      .replaceAll(" ", ".")}`
                  : ""
              }
              className="flex-1 placeholder:text-zinc-500 focus:outline-0"
              onFocus={() => setInfoActive(false)}
            />

            <div className="group relative flex">
              <button
                type="submit"
                className="flex items-center px-1 cursor-pointer"
              >
                <i className="di di-star-filled hover:text-accent-500 text-xl text-accent-300 duration-200"></i>
              </button>
              <Popover position="bottom-middle">Save Journal</Popover>
            </div>
          </form>
          <div className="journal flex flex-1 gap-0.5">
            <JournalEditor setAction={setEditorContent} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-center items-center gap-2 border-2 bg-blue-200">
            <i className="di di-pin-paper text-3xl text-blue-600"></i>
            <h2 className="text-xl font-medium">Upcoming Tasks</h2>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex-1">
              <div className="border p-2"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-center items-center gap-2 border-2 bg-primary-200">
            <i className="di di-trophy text-3xl text-primary-600"></i>
            <h2 className="text-xl font-medium">Your Goals</h2>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex-1">
              <div className="border p-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
