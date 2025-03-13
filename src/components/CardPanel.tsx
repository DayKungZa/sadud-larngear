import Card from "./Card";

export default function CardPanel(){
    return(
        <div className="flex flex-nowrap justify-center w-full">
            <Card venueName="The Bloom Pavilion" imgSrc="/img/bloom.jpg" description="Blooming flowers pavillion with many white tables something idk." />
            <Card venueName="Spark Space"imgSrc="/img/sparkspace.jpg" description="Spark Spacing full of creative, innovative ideas for students, business, and entrepeneurs sharing knowledge and ideas." />
            <Card venueName="The Grand Table" imgSrc="/img/grandtable.jpg" description="Grand tables looks very cool" />
        </div>
    );
};