import styles from "./banner.module.css";
import Image from "next/image";
import bgImage from "/public/image/party.jpg";

export default function Banner() {
    return (
        <div className={styles.banner}>
            <Image src={bgImage} alt="banner" fill={true} objectFit="cover"/>
            <div className={styles.bannerText}>
                <h1 className="text-4xl font-bold">where every event finds its venue</h1>
                <h4 className="text-xl font-medium">Finding and organizing the best venues for your events</h4>
            </div>
        </div>
    );
}