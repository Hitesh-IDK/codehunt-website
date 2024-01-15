"use client";

import { useEffect, useState } from "react";
import Header from "../header/header";
import UpdatesSection from "../updates/updates-section";
import styles from "./landing-layout.module.css";
import LandingLogin from "./landing-login";
import LandingPlaceholder from "./landing-placeholder";
import { CoordinatorData } from "@/contexts/login-ctx-provider";
import Cookies from "universal-cookie";
import { decryptData } from "@/helpers/cryption/cryption-methods";

export default function (): JSX.Element {
  const cookie = new Cookies(null, { path: "/" });

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinatorData, setCoordinatorData] = useState<
    CoordinatorData | undefined
  >(undefined);

  const [updatesActive, setUpdatesActive] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isMounted) return;

    if (isLoading) return;

    const storedData = cookie.get("Coordinator");

    if (!storedData) return;

    const coordinatorJson = decryptData(storedData);

    if (!coordinatorJson) {
      cookie.remove("Coordinator");
      return;
    }

    const coordinator = JSON.parse(coordinatorJson);
    setCoordinatorData(coordinator);
  }, [isMounted, isLoading]);

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
              />
            )}
          </div>
        )}

        {!isMounted && <div className={styles.loader}></div>}
      </div>
    </>
  );
}
