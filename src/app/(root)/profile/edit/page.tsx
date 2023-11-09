import {currentUser} from "@clerk/nextjs";

import AccountProfile from "@/src/components/forms/AccountProfile";
import {fetchUser} from "@/src/lib/actions/user.action";

async function Page(){
  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id);

  const userData = {
    id: user?.id,
    objectId: userInfo?.id,
    username: userInfo ? userInfo?.username : user?.username,
    name: userInfo ? userInfo?.name : user?.firstName || '',
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user?.imageUrl,
  };

  return (
    <main className={`mx-auto flex max-w-3xl w-auto flex-col justify-start`}>
      <h1 className={`head-text text-light-1`}>Edit Your Profile</h1>
      <p className={`mt-3 text-base-regular text-light-1`}>
        Update your profile now, polish your Borderless.
      </p>

      <section className={`mt-9 bg-dark-2 p-10`}>
        <AccountProfile user={userData} btnTitle='Continue' />
      </section>
    </main>
  )
}

export default Page;