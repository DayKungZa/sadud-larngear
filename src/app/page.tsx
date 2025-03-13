import Image from "next/image";
import styles from "./page.module.css";
import Banner from "@/components/Banner";
import Card from "@/components/Card";
import TopMenu from "@/components/TopMenu";
import CardPanel from "@/components/CardPanel";

export default function Home() {
  return (
    <main className={styles.main}>
      <Banner />
      <CardPanel/>
    </main>
  );
}