"use client";

import { useEffect, useState } from "react";
import Header from "../header/header";
import UpdatesSection from "../updates/updates-section";
import styles from "./landing-layout.module.css";
import LandingLogin from "./landing-login";
import LandingPlaceholder from "./landing-placeholder";
import { CoordinatorData } from "@/contexts/login-ctx-provider";
import Cookies from "universal-cookie";
import { decryptData, encryptData } from "@/helpers/cryption/cryption-methods";
import { InternalApiResponse } from "@/app/api/auth/route";

export default function (): JSX.Element {
  const cookie = new Cookies(null, { path: "/" });

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinatorData, setCoordinatorData] = useState<
    CoordinatorData | undefined
  >(undefined);

  const [time, setTime] = useState<number | undefined>();

  const [updatesActive, setUpdatesActive] = useState(false);

  const getTime = async () => {
    const storedTime = cookie.get("Time");
    if (storedTime) {
      const timeString = decryptData(storedTime);

      if (timeString) {
        const time = Number(timeString);

        if (!Number.isNaN(time)) {
          setTime(time);
          return;
        }
      }
    }

    const response = await fetch("/api/synchronize");
    const resData: InternalApiResponse = await response.json();

    console.log(resData);

    if (!response.ok) {
      //TODO - Show some error
      return;
    }

    if (!resData.success) {
      //TODO - Show some error
      return;
    }

    const time: number = resData.data.time;
    setTime(time);
    cookie.set("Time", encryptData(time.toString()));
  };

  useEffect(() => {
    setIsMounted(true);
    if (!isMounted) return;

    if (isLoading) return;

    if (updatesActive) {
      getTime();
    }

    const storedData = cookie.get("Coordinator");

    if (!storedData) return;

    const coordinatorJson = decryptData(storedData);

    if (!coordinatorJson) {
      cookie.remove("Coordinator");
      return;
    }

    const coordinator = JSON.parse(coordinatorJson);
    setCoordinatorData(coordinator);
  }, [isMounted, isLoading, updatesActive]);

  return (
    <>
      <div className={styles.main__container}>
        <Header />
        {isMounted && (
          <div className={styles.sub__container}>
            {coordinatorData && !updatesActive && (
              <LandingPlaceholder
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setUpdatesActive={setUpdatesActive}
              />
            )}
            {!coordinatorData && !updatesActive && (
              <LandingLogin
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setUpdatesActive={setUpdatesActive}
              />
            )}
            {updatesActive && (
              <UpdatesSection
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                time={time}
              />
            )}
          </div>
        )}

        {!isMounted && <div className={styles.loader}></div>}
      </div>
    </>
  );
}
