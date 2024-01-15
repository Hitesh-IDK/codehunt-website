import { Dispatch } from "react";
import styles from "./landing-placeholder.module.css";

export default function ({
  isLoading,
  setIsLoading,
  setUpdatesActive,
}: {
  isLoading: boolean;
  setIsLoading: Dispatch<boolean>;
  setUpdatesActive: Dispatch<boolean>;
}): JSX.Element {
  return (
    <>
      <div className={styles.holder__title}>Logged in</div>
      <div className={styles.holder__desc}>
        If a participant approaches you, please scan the QR code on their Clue
        Card, and verify it! You can scan the qr code using Google lens or any
        Scanners provided by your mobile!
      </div>
      <div className={styles.holder__updates}>Want to know the updates?</div>
      <button
        className={styles.btn__updates}
        onClick={() => {
          setUpdatesActive(true);
        }}
      >
        Updates
      </button>
    </>
  );
}
