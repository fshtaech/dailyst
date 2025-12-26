import { useState, useEffect, type JSX } from "react";
import { JournalEditor } from "../components/JournalEditor";
import { getRandomArrayItem } from "../lib/utils/get";
import { greetings } from "../assets/message/greetings";
import { useAuthContext } from "../db/firebase/contexts/AuthContext";

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

  return (
    <div className="page">
      <div className="header relative h-40 w-full p-4 flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[.5px]"
          style={{
            backgroundImage: `url(/images/wall-1.png)`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="flex w-full justify-between">
          <span className="flex flex-col z-2 text-xl text-text-200 wrap-anywhere text-ellipsis">
            <h1 className="text-2xl md:text-3xl text-text-50 selection:text-text-600 wrap-anywhere">
              Good{" " + greeting}
              {currentUser ? ", " : "!"}
              {currentUser && <span>{currentUser.username}!</span>}
            </h1>
            {greetingMessage}
          </span>
        </div>
      </div>
      <div className="flex flex-col w-full h-full min-h-0 gap-2 p-2 lg:grid lg:grid-cols-8">
        <div className="flex col-span-4">
          <JournalEditor />
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <div className="flex justify-center items-center gap-2 border-2 rounded-md bg-blue-200">
            <i className="di di-pin-paper text-3xl text-blue-600"></i>
            <h2 className="text-xl font-medium">Upcoming Tasks</h2>
          </div>
          <div className="flex flex-col gap-2"></div>
        </div>

        <div className="flex flex-col gap-2 col-span-2">
          <div className="flex justify-center items-center gap-2 border-2 rounded-md bg-primary-200">
            <i className="di di-trophy text-3xl text-primary-600"></i>
            <h2 className="text-xl font-medium">Your Goals</h2>
          </div>
          <div className="flex flex-col gap-2"></div>
        </div>
      </div>
    </div>
  );
};
