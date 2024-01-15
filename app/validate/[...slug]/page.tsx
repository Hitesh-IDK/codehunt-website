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
import Cookies from "universal-cookie";
import { decryptData } from "@/helpers/cryption/cryption-methods";
import { CoordinatorData } from "@/contexts/login-ctx-provider";
import { UpdatesReqData } from "@/app/api/updates/route";

export default function ({
  params: { slug },
}: {
  params: { slug: string[] };
}): JSX.Element {
  const cookie = new Cookies(null, { path: __dirname });

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean>(false);

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
    coordinator: CoordinatorData,
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

    console.log(prevLocation, nextLocation);

    if (prevPosition === 0) {
      prevLocation = {
        location_id: 0,
        reference_id: 0,
        name: "Starting Point",
      };
    }

    console.log(prevLocation);

    if (!nextLocation || !prevLocation) return false;

    if (
      (nextLocation as LocationData).location_id -
        (prevLocation as LocationData).location_id ===
      1
    ) {
      console.log(coordinator, nextLocation);

      if (
        (nextLocation as LocationData).reference_id === coordinator.reference_id
      )
        return true;
    }

    return false;
  };

  const sendUpdates = async (
    coordinator: CoordinatorData,
    route: RouteData,
    batch: string,
    nextPosition: number
  ) => {
    const teamNo =
      (batch === "A" ? 0 : batch === "B" ? 12 : batch === "C" ? 24 : 36) +
      route.route_id;

    let locationId = undefined;

    route.location.forEach((loc) => {
      if (loc.reference_id === nextPosition) locationId = loc.location_id;
    });

    const reqData: UpdatesReqData = {
      coordinator,
      insert_time: Date.now(),
      message: `Team ${teamNo} has reached checkpoint ${locationId}`,
    };

    const response = await fetch("/api/updates", {
      method: "POST",
      body: JSON.stringify(reqData),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      //TODO -Show some error
      return;
    }
  };

  const validatePage = async () => {
    if (slug.length !== 3) {
      router.push("/");
    }

    const storedCoordinator = cookie.get("Coordinator");

    if (!storedCoordinator) {
      console.log("Show error");
      router.push("/");
      return;
    }

    const coordinatorJson = decryptData(storedCoordinator);
    if (!coordinatorJson) {
      console.log("Show error");
      router.push("/");
      return;
    }

    const coordinatorData: CoordinatorData = JSON.parse(coordinatorJson);
    console.log(coordinatorData);

    const teamCode = slug[0];
    const lastLocation = Number(slug[1]);
    const nextLocation = Number(slug[2]);

    let msg = "";

    const batch = teamCode.slice(0, 1).toUpperCase();
    const routeId = Number(teamCode.slice(1, 3));

    const possibleBatches = ["A", "B", "C"];

    if (Number.isNaN(lastLocation) || Number.isNaN(nextLocation))
      msg = msg + "Invalid Location Ids! ";
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

    if (!validatePosition(coordinatorData, route, lastLocation, nextLocation)) {
      return;
    }

    setIsValid(true);

    await sendUpdates(coordinatorData, route, batch, nextLocation);
  };

  useEffect(() => {
    setIsMounted(true);

    if (!isMounted) return;

    setIsLoading(true);
    validatePage().then(() => {
      setIsLoading(false);
    });
  }, [isMounted]);

  return (
    <>
      <div className={styles.main__container}>
        <Header />
        {isMounted && !isLoading && (
          <div className={styles.sub__container}>
            {isValid ? validCheck : invalidCheck}
            <button
              className={styles.btn__home}
              onClick={() => {
                router.push("/");
              }}
            >
              Home
            </button>
          </div>
        )}

        {(!isMounted || isLoading) && <div className={styles.loader}></div>}
      </div>
    </>
  );
}
