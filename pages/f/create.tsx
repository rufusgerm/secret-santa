import { Prisma } from "@prisma/client";
import router from "next/dist/client/router";
import { FamilyIdOnly } from "pages/api/read/family";
import { FormEvent, useState } from "react";

export default function CreateFamily() {
  const [name, setName] = useState<string>("");

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const family: Prisma.FamilyCreateInput = {
      name: name,
    };

    const response = await fetch("/api/create/family", {
      method: "POST",
      body: JSON.stringify(family),
    });

    // handle errors with actual user feedback
    if (!response.ok) {
      let msg = await response.json();
      console.log(
        `Status ${response.status}-${response.statusText} - ${msg.message}`
      );
      return false;
    }

    const newFamily: FamilyIdOnly = (await response.json()) as FamilyIdOnly;

    router.push(`${newFamily.id}`);
  };

  return (
    <div>
      <h1>Create Family</h1>
      <div>
        <h1>Welcome to the santa creation screen!</h1>
        <div>
          <form onSubmit={handleCreate}>
            <div>
              <label>Family Name </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Family Name"
              />
            </div>
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}
