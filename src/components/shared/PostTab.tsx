import {fetchUserPosts} from "@/src/lib/actions/user.action";
import PostCard from "@/src/components/cards/PostCard";
import {fetchCommunityPosts} from "@/src/lib/actions/community.actions";

type Props = {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

export default async function PostTab({
  currentUserId,
  accountId,
  accountType,
} : Props){
  let result: any;

  if(accountType === 'Community'){
    result = await fetchCommunityPosts(accountId);
  }else {
    result = await fetchUserPosts(accountId);
  }

  return (
    <section className={`mt-9 flex flex-col gap-10`}>
      {result.post.map((post: any)=>(
        <PostCard
          key={post._id}
          id={post._id}
          currentUserId={currentUserId}
          parentId={post.parentId}
          content={post.text}
          author={
            accountType === 'User'
              ?{name: result.name, image: result.image, id: result.id}
              :{name: post.author.name, image: post.author.image, id: post.author.id}
          }
          community={
            accountType === "Community"
            ? {name: result.name, id: result.id, image: result.image}
            : post.community
          }
          createdAt={post.createdAt}
          comments={post.children} />
      ))}
    </section>
  )
}