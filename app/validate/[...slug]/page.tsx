"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Header from "@/components/header/header";
import { useRouter } from "next/navigation";
import { LocationData, RouteData, RouteReqData } from "@/app/api/routes/route";
import { InternalApiResponse } from "@/app/api/auth/route";
import {
  invalidCheck,
  validCheck,
} from "@/components/updates/valid-checkmarks";

export default function ({
  params: { slug },
}: {
  params: { slug: string[] };
}): JSX.Element {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const getRoute = async (route_id: number): Promise<RouteData | undefined> => {
    const reqData: RouteReqData = {
      route_id,
    };

    const response = await fetch("/api/routes", {
      method: "POST",
      body: JSON.stringify(reqData),
      headers: {
        "Content-type": "application/json",
      },
    });
    const resData: InternalApiResponse = await response.json();

    if (!response.ok) {
      //TODO - Show some error
      return;
    }

    if (!resData.success) {
      //TODO - Show some error
      return;
    }

    return resData.data;
  };

  const validatePosition = (
    route: RouteData,
    prevPosition: number,
    nextPosition: number
  ): boolean => {
    let prevLocation: LocationData | undefined = undefined;
    let nextLocation: LocationData | undefined = undefined;

    const locations = route.location;

    locations.forEach((location) => {
      if (location.reference_id === prevPosition) prevLocation = location;
      if (location.reference_id === nextPosition) nextLocation = location;
    });

    if (!prevLocation || !nextLocation) return false;

    // if(prevLocation)
    return true;
  };

  const validatePage = async () => {
    if (slug.length !== 3) {
      router.push("/");
    }

    const teamCode = slug[0];
    const lastLocation = slug[1];
    const nextLocation = slug[2];

    let msg = "";

    const batch = teamCode.slice(0, 1).toUpperCase();
    const routeId = Number(teamCode.slice(1, 3));

    const possibleBatches = ["A", "B", "C"];

    if (!possibleBatches.includes(batch)) msg = msg + "Invalid Batch! ";
    if (Number.isNaN(routeId)) msg = msg + "Invalid Route! ";
    if (!(routeId <= 12 && routeId > 0)) msg += "Route out of bounds! ";

    if (msg.length !== 0) {
      //TODO - Show errrors
      console.log(msg);

      return;
    }

    const route: RouteData | undefined = await getRoute(routeId);
    if (!route) return;
  };

  useEffect(() => {
    setIsMounted(true);

    if (!isMounted) return;

    validatePage();
  }, [isMounted]);

  return (
    <>
      <div className={styles.main__container}>
        <Header />
        {isMounted && (
          <div className={styles.sub__container}>
            {validCheck}
            {invalidCheck}
          </div>
        )}

        {!isMounted && <div className={styles.loader}></div>}
      </div>
    </>
  );
}
