"use client";

import { Dispatch, useEffect, useState } from "react";
import styles from "./landing-layout.module.css";
import { AuthReqData, InternalApiResponse } from "@/app/api/auth/route";
import Cookies from "universal-cookie";
import { encryptData } from "@/helpers/cryption/cryption-methods";

export default function ({
  isLoading,
  setIsLoading,
  setUpdatesActive,
}: {
  isLoading: boolean;
  setIsLoading: Dispatch<boolean>;
  setUpdatesActive: Dispatch<boolean>;
}): JSX.Element {
  const cookie = new Cookies(null, { path: "/" });

  const [idInput, setIdInput] = useState("");

  const idInputHandler = (e: React.ChangeEvent) => {
    e.preventDefault();

    const target = e.target as HTMLInputElement;
    const inputValue = target.value;

    if (Number.isNaN(Number(inputValue))) return;

    setIdInput(inputValue);
  };

  const loginHandler = async (e: React.MouseEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (idInput.length !== 6) {
      //TODO - Show error here
      console.log("Not 6");

      return;
    }

    const reqData: AuthReqData = {
      coordinator_id: idInput,
    };

    const response = await fetch("/api/auth", {
      method: "POSt",
      body: JSON.stringify(reqData),
      headers: {
        "Content-type": "application/json",
      },
    });
    const resData: InternalApiResponse = await response.json();

    if (!response.ok) {
      //TODO - Show some error
      setIsLoading(false);
      return;
    }

    if (!resData.success) {
      //TODO - Show some error
      setIsLoading(false);
      return;
    }

    const encryptedData = encryptData(JSON.stringify(resData));
    cookie.set("Coordinator", encryptedData);

    // setUpdateState(true);
    setIsLoading(false);
  };

  // useEffect(() => {}, [isLoading]);

  return (
    <>
      <div className={styles.title}>Login</div>
      {!isLoading && (
        <>
          <div className={styles.login__container}>
            <div>Co-Ordinator?</div>
            <input
              onChange={idInputHandler}
              value={idInput}
              className={styles.inp__login}
              type="password"
              placeholder="Coordinator ID"
            ></input>
            <button
              onClick={loginHandler}
              className={`${styles.btn__login} ${styles.btn}`}
            >
              Login
            </button>
          </div>

          <div className={styles.divider__or}>or</div>
          <button
            onClick={() => setUpdatesActive(true)}
            className={`${styles.btn__spectate} ${styles.btn}`}
          >
            Spectate
          </button>
        </>
      )}

      {isLoading && <div className={styles.loader}></div>}
    </>
  );
}
