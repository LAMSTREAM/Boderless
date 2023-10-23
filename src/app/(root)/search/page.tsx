import {currentUser} from "@clerk/nextjs";
import {redirect} from "next/navigation";

import {fetchUser, fetchUsers} from "@/src/lib/actions/user.action";
import UserCard from "@/src/components/cards/UserCard";

export default async function Page(){
  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onboarded) redirect('/onboarding');

  const {users, isNext} = await fetchUsers({
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'desc',
  })


  return (
    <section>
      <h1 className={`head-text mb-10`}>Search</h1>

      <div className={`mt-14 flex flex-col gap-9`}>
        {users.length === 0 ? (
          <p className={`no-result`}>No users</p>
        ) : (
          <>
            {users.map(person => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imageUrl={person.image}
                personType={`User`}
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}