import styles from "./header.module.css";

import technocrats from "@/public/images/technocrats.png";
import Image from "next/image";

export default function (): JSX.Element {
  return (
    <>
      <div className={styles.header__container}>
        <Image src={technocrats} alt="Technocrats Logo" height={125} />
        <div className={styles.header__title}>Code Hunt</div>
      </div>
    </>
  );
}
