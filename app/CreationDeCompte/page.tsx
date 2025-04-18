export default async function Page() {

    return (
        <div>
            <h1>Création de Compte</h1>
            <form>
                <label>
                    Nom :
                    <input type="text" name="name"/>
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};
