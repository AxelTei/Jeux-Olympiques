'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    function getMenuClasses(){
        let menuCLasses: string[] = [];

        if (isOpen) {
            menuCLasses = [
                "flex",
                "absolute",
                "top-[90px]",
                "bg-gray-100",
                "w-full",
                "p-4",
                "left-0",
                "gap-10",
                "flex-col"
            ];
        } else {
            menuCLasses = ["hidden", "md:flex"]
        }

        return menuCLasses.join(" ");
    };

    return (
        <nav className="bg-gray-100 text-gray-500 p-4 sm:p-6 md:flex md:justify-between md:items-center">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <Image src="/Olympic_logo.png" alt="logo des jeux olympiques" width={100} height={100} />
                </Link>
                <div className={getMenuClasses()}>
                    <Link href="/" className="mx-2 hover:text-black">Accueil</Link>
                    <Link href="#" className="mx-2 hover:text-black">Nos Offres</Link>
                    <Link href="#" className="mx-2 hover:text-black">Contact</Link>
                    <Link href="#" className="mx-2 hover:text-black">Panier</Link>
                    <Link href="#" className="mx-2 hover:text-black">Connexion</Link>{/*En attente de se transformer en composant */}
                </div>

                <div className="md:hidden flex items-center">
                    <button onClick={()=>{
                        setIsOpen(!isOpen)
                    }}>
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000.svg"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                ></path>
                            )}
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    )
}