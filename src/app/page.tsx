import Image from "next/image";
import styles from "./page.module.css";
import Banner from "@/components/Banner";
import Card from "@/components/Card";
import TopMenu from "@/components/TopMenu";

export default function Home() {
  return (
    <main className={styles.main}>
      <Banner />
      <div className={styles.cardsection}>
        <Card venueName="The Bloom Pavilion" imgSrc="/img/bloom.jpg" description="Blooming flowers pavillion with many white tables something idk." />
        <Card venueName="Spark Space"imgSrc="/img/sparkspace.jpg" description="Spark Spacing full of creative, innovative ideas for students, business, and entrepeneurs sharing knowledge and ideas." />
        <Card venueName="The Grand Table" imgSrc="/img/grandtable.jpg" description="Grand tables looks very cool" />
      </div>
    </main>
  );
}