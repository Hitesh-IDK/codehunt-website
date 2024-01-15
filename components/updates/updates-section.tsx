"use client";

import { Dispatch, useEffect, useState } from "react";
import styles from "./updates-section.module.css";

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

  const [isMounted, setIsMounted] = useState(false);

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

      setTimer((prevTimer) => {
        // const min = prevTimer.slice(0, 1);
        // const seconds = min === "1" ? 59 : Number(prevTimer.slice(2, 4)) - 1;
        const seconds = (59 - Math.trunc(((Date.now() - time) % 60000) / 1000))
          .toString()
          .padStart(2, "0");

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
        <div className={styles.update__msg}>
          Team 1 just cleared the first checkpoint!
        </div>
        <div className={styles.update__msg}>
          Team 5 just cleared the first checkpoint!
        </div>
        <div className={styles.update__msg}>
          Team 5 just cleared the first checkpoint!
        </div>
        <div className={styles.update__msg}>
          Team 5 just cleared the first checkpoint!
        </div>
        <div className={styles.update__msg}>
          Team 5 just cleared the first checkpoint!
        </div>
        <div className={styles.update__msg}>
          Team 5 just cleared the first checkpoint!
        </div>
        <div className={styles.update__msg}>
          Team 5 just cleared the first checkpoint!
        </div>
        <div className={styles.update__msg}>
          Team 5 just cleared the first checkpoint!
        </div>
        <div className={styles.update__msg}>
          Team 5 just cleared the first checkpoint!
        </div>
        <div className={styles.update__msg}>
          Team 5 just cleared the first checkpoint!
        </div>
        <div className={styles.update__msg}>
          Team 5 just cleared the first checkpoint!
        </div>
      </div>
    </>
  );
}
