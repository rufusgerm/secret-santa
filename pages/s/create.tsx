import { Prisma } from "@prisma/client";
import { isValidEmail } from "@shared/utils/email";
import { FormEvent, useState } from "react";

export default function Create() {
    const [fName, setFName] = useState<string>("");
    const [lName, setLName] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(e);

        if (!isValidEmail(email)) {
            console.log('Invalid email!');
            return false;
        }

        const santa: Prisma.SantaCreateInput = { first_name: fName, last_name: lName, email: email }
        
        const response = await fetch('/api/create/santa', {
            method: "POST",
            body: JSON.stringify(santa)
        });


        if (!response.ok) {
            let msg = await response.json()
            console.log(`Status ${response.status}-${response.statusText} - ${msg.message}`)
            return false;
        }
        
    }

    return (
        <div>
            <h1>Welcome to the creation screen!</h1>
            <form onSubmit={ handleCreate }>
                    <label>First Name </label>
                    <input type="text" value={fName} onChange={e => setFName(e.target.value)} required aria-label="First Name"></input>
                    <label>Last Name </label>
                    <input type="text" value={lName} onChange={e => setLName(e.target.value)} required aria-label="Last Name" />
                    <label>Email </label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required aria-label="Email" />
                    <button type="submit">Create</button>
                </form>
        </div>
    )
}