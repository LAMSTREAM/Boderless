import {currentUser} from "@clerk/nextjs";
import {redirect} from "next/navigation";

import {fetchUser} from "@/src/lib/actions/user.action";
import NewPost from "@/src/components/forms/NewPost";

export default async function Page() {
  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onboarded) redirect('/onboarding');

  return (
    <>
      <h1 className='head-text'>Create Post</h1>

      <NewPost userId={userInfo._id.toString()}/>
    </>
  );
}