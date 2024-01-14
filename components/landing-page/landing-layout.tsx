import Header from "../header/header";
import styles from "./landing-layout.module.css";
import LandingLogin from "./landing-login";
import LandingPlaceholder from "./landing-placeholder";

export default function (): JSX.Element {
  return (
    <>
      <div className={styles.main__container}>
        <Header />
        <div className={styles.sub__container}>
          <LandingPlaceholder />
          {/* <LandingLogin /> */}
        </div>
      </div>
    </>
  );
}
