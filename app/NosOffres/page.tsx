import Link from "next/link";

export default async function Page() {
    //const data = await fetch('http://localhost:8081/api/bookingOffer', {method:"GET"})
    //const posts = await data.json()
    return (
        <div>
            <h1>Nos Offres</h1>
            <div>
                {/* <ul>
                    {posts.map((post) => (
                        <li key={post.id}>{post.title},{post.price},{post.numberOfCustomers}</li>
                    ))}
                </ul> */}
            </div>
            <Link href="/CreationDeCompte">Création de compte</Link>
        </div>
    );
};
