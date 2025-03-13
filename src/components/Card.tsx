import InteractiveCard from "./InteractiveCard";
import Image from "next/image";
import RatingComponent from "./RatingComponent";

interface CardProps {
    venueName: string;
    imgSrc: string;
    description: string;
}

export default function Card({venueName, imgSrc, description}:CardProps) {
    return (
        <div className="bg-purple-200 w-[110%] rounded-lg p-3 mx-3 my-6">
            <InteractiveCard>
                <Image className="rounded-lg" src={imgSrc} alt="card" width={400} height={300}/>
                <div className="px-2 py-3 h-[90%]">
                    <h2 className="text-3xl font-bold text-purple-900" >{venueName}</h2>
                    <p className="text-black">{description}</p>
                    <RatingComponent venueName={venueName} />
                </div>
                
            </InteractiveCard>
        </div>
    );
}