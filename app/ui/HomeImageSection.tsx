import Image from "next/image";

export default function HomeImageSection() {
    return (
        <div className="flex justify-center">
            <Image src="/nathan-cima-photo.jpg" alt="Photo d'une statut du logo des Jeux Olympiques en plein milieu de Paris - Photo réalisé par Nathan Cima" width={2000} height={1000}/>
        </div>
    )
}