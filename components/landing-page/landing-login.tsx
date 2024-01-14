import styles from "./landing-layout.module.css";

export default function (): JSX.Element {
  return (
    <>
      <div className={styles.title}>Login</div>
      <div className={styles.login__container}>
        <div>Co-Ordinator?</div>
        <input
          className={styles.inp__login}
          type="password"
          placeholder="Coordinator ID"
        ></input>
      </div>
      <button className={`${styles.btn__login} ${styles.btn}`}>Login</button>
      <div className={styles.divider__or}>or</div>
      <button className={`${styles.btn__spectate} ${styles.btn}`}>
        Spectate
      </button>
    </>
  );
}
