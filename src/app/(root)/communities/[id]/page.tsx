import {currentUser} from "@clerk/nextjs";

import ProfileHeader from "@/src/components/shared/ProfileHeader";
import ClientTab from "@/src/components/shared/_ClientTab";
import PostTab from "@/src/components/shared/PostTab";
import {communityTabs} from "@/constants";
import {fetchCommunityDetails} from "@/src/lib/actions/community.actions";

export default async function Page({ params }: {params: {id: string}}){
  const user = await currentUser();
  if(!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imageUrl={communityDetails.image}
        bio={communityDetails.bio}
        type={`Community`}
      />

      <ClientTab len={communityDetails.post.length} tabDetail={JSON.stringify(communityTabs)}>
        <PostTab
          currentUserId={user.id}
          accountId={communityDetails._id}
          accountType='Community'
        />
      </ClientTab>
    </section>
  )
}