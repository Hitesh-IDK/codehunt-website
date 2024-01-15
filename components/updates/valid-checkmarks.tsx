import styles from "./valid-checkmarks.module.css";

export const validCheck: JSX.Element = (
  <>
    <svg
      className={`${styles.checkmark} ${styles.success}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
    >
      <circle
        className={styles.checkmark_circle_success}
        cx="26"
        cy="26"
        r="25"
        fill="none"
      />
      <path
        className={styles.checkmark_check}
        fill="none"
        d="M14.1 27.2l7.1 7.2 16.7-16.8"
        strokeLinecap="round"
      />
    </svg>
  </>
);

export const invalidCheck: JSX.Element = (
  <>
    <svg
      className={`${styles.checkmark} ${styles.error}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
    >
      <circle
        className={styles.checkmark_circle_error}
        cx="26"
        cy="26"
        r="25"
        fill="none"
      />
      <path
        className={styles.checkmark_check}
        strokeLinecap="round"
        fill="none"
        d="M16 16 36 36 M36 16 16 36
"
      />
    </svg>
  </>
);
