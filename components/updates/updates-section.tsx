"use client";

import { Dispatch, useEffect, useState } from "react";
import styles from "./updates-section.module.css";
import { InternalApiResponse } from "@/app/api/auth/route";
import { UpdatesReqData } from "@/app/api/updates/route";

export default function ({
  isLoading,
  setIsLoading,
  time,
}: {
  isLoading: boolean;
  setIsLoading: Dispatch<boolean>;
  time: number | undefined;
}): JSX.Element {
  const [refreshingTextDots, setRefreshingTextDots] = useState("...");
  const [timer, setTimer] = useState(`0:00`);
  const [updates, setUpdates] = useState<UpdatesReqData[]>([]);

  const [isMounted, setIsMounted] = useState(false);

  const getUpdates = async () => {
    const response = await fetch("/api/updates");
    const resData: InternalApiResponse = await response.json();

    if (!response.ok) {
      //TODO - Show some error
      return;
    }

    const updatesData: UpdatesReqData[] = resData.data;
    const sortedUpdates = updatesData.sort(function (a, b): number {
      return b.insert_time - a.insert_time;
    });

    setUpdates(sortedUpdates);
  };

  useEffect(() => {
    setIsMounted(true);
    if (!isMounted) return;

    setInterval(() => {
      setRefreshingTextDots((prevDots) => {
        if (prevDots.length === 3) {
          return ".";
        } else {
          return prevDots + ".";
        }
      });

      if (!time) return;

      const seconds = (59 - Math.trunc(((Date.now() - time) % 60000) / 1000))
        .toString()
        .padStart(2, "0");

      if (seconds === "01") {
        getUpdates();
      }

      setTimer((prevTimer) => {
        // const min = prevTimer.slice(0, 1);
        // const seconds = min === "1" ? 59 : Number(prevTimer.slice(2, 4)) - 1;

        return `0:${seconds}`;
      });
    }, 1000);
  }, [isMounted, setRefreshingTextDots, time]);

  return (
    <>
      <div className={styles.refresh__title}>
        Refreshing in{refreshingTextDots}
      </div>
      <div className={styles.refresh__timer}>{timer}</div>
      <div className={styles.updates}>
        {updates.length !== 0 ? (
          updates.map((update) => {
            return (
              <div
                key={update.insert_time}
                className={styles.updates__sub_container}
              >
                <div className={styles.update__msg}>{update.message}</div>
                <div className={styles.update__time}>
                  {new Date(update.insert_time).toLocaleTimeString()}
                </div>
              </div>
            );
          })
        ) : (
          <div key={Date.now()} className={styles.update__msg}>
            No Updates at the moment! Or wait for the refresh timer to refresh
            the updates!
          </div>
        )}
      </div>
    </>
  );
}
