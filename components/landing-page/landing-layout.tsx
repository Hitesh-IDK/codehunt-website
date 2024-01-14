import Header from "../header/header";
import styles from "./landing-layout.module.css";

export default function (): JSX.Element {
  return (
    <>
      <div className={styles.main__container}>
        <Header />
        <div className={styles.sub__container}>
          <div className={styles.title}>Login</div>
          <div className={styles.login__container}>
            <div>Co-Ordinator?</div>
            <input
              className={styles.inp__login}
              type="password"
              placeholder="Coordinator ID"
            ></input>
          </div>
          <div className={styles.divider__or}>or</div>
          <button className={styles.btn__spectate}>Spectate</button>
        </div>
      </div>
    </>
  );
}
