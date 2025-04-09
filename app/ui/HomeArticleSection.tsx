import Image from "next/image";
import Link from "next/link";
import { poppins } from "./fonts";

export default function HomeArticleSection() {
    return (
        <div className="grid sm:grid-cols-3 sm:h-100">
            <div className="grid justify-items-end content-end border border-solid border-gray-400">
                <h1 className={`${poppins.className} mb-6 mr-12 text-xl font-bold ml-6 mt-4 sm:mt-0`}>Olympic Games Paris 2024</h1>
                <ul className="mb-8 mr-12">
                    <li className="hover:text-[#d7c378]">Aperçu général</li>
                    <li className="hover:text-[#d7c378]">Replays & meilleurs moments</li>
                    <li className="hover:text-[#d7c378]">Résultats</li>
                    <li className="hover:text-[#d7c378]">Athlètes</li>
                    <li className="hover:text-[#d7c378]">Actualités</li>
                    <li className="hover:text-[#d7c378]">Marque</li>
                    <li className="hover:text-[#d7c378]">Design des médailles</li>
                    <li className="hover:text-[#d7c378]">Mascotte</li>
                    <li className="hover:text-[#d7c378]">Flamme</li>
                </ul>
            </div>
            <div className="grid justify-items-center content-center border border-solid border-gray-400">
                <Image src="/logo-Jeux-OL-2024.png" alt="Icone des Jeux Olympiques 2024" width={300} height={300}/>
            </div>
            <div className={`${poppins.className} grid content-center border border-solid border-gray-400`}>
                <h1 className="mb-6 ml-4 sm:ml-12 text-2xl font-medium mt-4 sm:mt-0">Paris 2024</h1>
                <p className="lg:w-80 sm:w-45 w-80 ml-4 sm:ml-12">Que vous soyez seul, accompagné ou en famille, les Jeux Olympiques 2024 de Paris vous ouvre ses portes !</p>
                <p className="lg:w-80 sm:w-45 w-80 ml-4 sm:ml-12 mb-6">Parcourez nos multiples Offres en cliquant sur le bouton ci-dessous.</p>
                <Link href="/NosOffres" className="ml-4 sm:ml-12 text-lg bg-[#d7c378] hover:bg-white rounded-md border border-solid border-gray-300 w-48 sm:w-48 h-10 mb-6 flex justify-center items-center">Billetterie</Link>
            </div>
        </div>
    )
}
