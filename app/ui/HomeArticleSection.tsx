import Image from "next/image";

export default function HomeArticleSection() {
    return (
        <div className="grid grid-cols-3 h-100">
            <div className="grid justify-items-end content-end border border-solid border-gray-400">
                <h1>Olympic Games Paris 2024</h1>
                <ul>
                    <li>Aperçu général</li>
                    <li>Replays & meilleurs moments</li>
                    <li>Résultats</li>
                    <li>Athlètes</li>
                    <li>Actualités</li>
                    <li>Marque</li>
                    <li>Design des médailles</li>
                    <li>Mascotte</li>
                    <li>Flamme</li>
                </ul>
            </div>
            <div className="grid justify-items-center content-center border border-solid border-gray-400">
                <Image src="/logo-Jeux-OL-2024.png" alt="Icone des Jeux Olympiques 2024" width={300} height={300}/>
            </div>
            <div className="grid content-end border border-solid border-gray-400">
                <h1>PARIS 2024</h1>
                <p>Que vous soyez seul, accompagné ou en famille, les Jeux Olympiques 2024 de Paris vous ouvre ses portes</p>
                <p>Parcourez nos multiples Offres en cliquant sur le bouton ci-dessous.</p>
                <button>Billetterie</button>
            </div>
        </div>
    )
}