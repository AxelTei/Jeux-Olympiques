'use client';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from '../services/authService';
import { getAuthToken, getRole } from "../services/authService";

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = getAuthToken();
        setIsLoggedIn(!!token);
        const role = getRole();
        if (role === '["ROLE_ADMIN"]') {
            setIsAdmin(!!role);
        }
    }, []);

    const handleAuth = () => {
        if (isLoggedIn) {
            //Déconnexion: supprimer le token et mettre à jour l'état
            logoutUser();
            setIsLoggedIn(false);
            setIsAdmin(false);
            //Retour Accueil
            router.push('/?success=true&message=Vous%20%C3%AAtes%20maintenant%20d%C3%A9connect%C3%A9')
        } else {
            router.push('/Login');
        }
    }

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
                    <Link href="/" className="mx-2 hover:text-black flex items-center">Accueil</Link>
                    <Link href="/NosOffres" className="mx-2 hover:text-black flex items-center">Nos Offres</Link>
                    <Link href="#" className="mx-2 hover:text-black flex items-center">Contact</Link>
                    {isLoggedIn && (<Link href="/Panier" className="mx-2 hover:text-black flex items-center">Panier</Link>)}
                    {isAdmin && (<Link href="/GestionDesOffres" className="mx-2 hover:text-black flex items-center">Gestion des Offres</Link>)}
                    <button onClick={handleAuth} className="mx-2 bg-blue-100 text-black rounded-full w-32 h-10 flex items-center justify-center md:ml-10">{isLoggedIn ? 'Déconnexion' : 'Connexion'}</button>
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