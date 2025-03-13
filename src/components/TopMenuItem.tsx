import Link from "next/link";

export default function TopMenuItem() {
    return (
        <Link href="/booking" className="h-full px-5 bg-yellow-200 text-black text-center flex flex-col justify-center cursor-pointer">
            <h1 className="text-l font-medium">Menu Item</h1>
            <h1 className="text-xl font-bold">Booking</h1>
        </Link>
    );
}
