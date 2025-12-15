import { useState, useEffect, type JSX } from "react";

export const Home = (): JSX.Element => {
  const [time, setTime] = useState<number>(new Date().getTime());

  const parseTime = (time: number): string => {
    return new Date(time).toLocaleTimeString("en-PH", { hour12: true });
  };

  const parseDate = (time: number): string => {
    return new Date(time).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      weekday: "narrow",
      day: "2-digit",
    });
  };

  const getGreeting = (parseTime: string) => {
    const splitTime: string[] = parseTime.split(":");
    const hour: number = Number(splitTime[0]);
    const merridian: string = splitTime[splitTime.length - 1]
      .split(" ")[1]
      .toLowerCase();

    return merridian == "am"
      ? "morning"
      : merridian == "pm" && 5 >= hour && hour <= 12
      ? "afternoon"
      : "evening";
  };

  useEffect(() => {
    setInterval(() => {
      setTime(new Date().getTime());
    }, 1000);
  });

  return (
    <div className="page">
      <div className="flex flex-col z-2">
        <h1 className="text-4xl bg-linear-to-r/shorter from-accent-400 to-primary-300 text-transparent bg-clip-text">
          Good{" " + getGreeting(parseTime(time))}
        </h1>
      </div>
    </div>
  );
};
