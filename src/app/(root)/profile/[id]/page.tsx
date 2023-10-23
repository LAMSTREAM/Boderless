import 'server-only';

import {currentUser} from "@clerk/nextjs";
import {redirect} from "next/navigation";

import {fetchUser} from "@/src/lib/actions/user.action";
import ProfileHeader from "@/src/components/shared/ProfileHeader";
import ClientTab from "@/src/components/shared/_ClientTab";
import PostTab from "@/src/components/shared/PostTab";
import {profileTabs} from "@/constants";
import {Button} from "react-bootstrap";

export default async function Page({ params }: {params: {id: string}}){
  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(params.id);
  if(!userInfo?.onboarded) redirect('/onboarding');

  if(params.id === user.id){

  }

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imageUrl={userInfo.image}
        bio={userInfo.bio}
      >
        {params.id === user.id && (
          <Button href={`/onboarding`}>
            Edit Profile
          </Button>
        )}
      </ProfileHeader>

      <ClientTab len={userInfo.post.length} tabDetail={JSON.stringify(profileTabs)}>
        <PostTab
          currentUserId={user.id}
          accountId={userInfo.id}
          accountType='User'
        />,
      </ClientTab>
    </section>
  )
}