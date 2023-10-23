import {currentUser} from "@clerk/nextjs";
import {redirect} from "next/navigation";

import {fetchUser} from "@/src/lib/actions/user.action";
import {fetchPostById} from "@/src/lib/actions/post.actions";
import PostCard from "@/src/components/cards/PostCard";
import Comment from "@/src/components/forms/Comment";

export default async function Page({params}: {params: {id: string}}){
  if(!params.id) return null;

  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onboarded) redirect(`/onboarding`);

  const post = await fetchPostById(params.id);

  return (
    <section className={`relative`}>
      <div>
        <PostCard
          key={post._id}
          id={post._id}
          currentUserId={user?.id || ""}
          parentId={post.parentId}
          content={post.text}
          author={post.author}
          community={post.community}
          createdAt={post.createdAt}
          comments={post.children} />
      </div>

      <div className={`mt-7`}>
        <Comment
          postId={post.id}
          currentUserImg={userInfo.image}
          currentUserId={userInfo._id.toString()}
        />
      </div>

      <div className={`mt-10`}>
        {post.children.map((subPost: any) => (
          <PostCard
            key={subPost._id}
            id={subPost._id}
            currentUserId={user?.id || ""}
            parentId={subPost.parentId}
            content={subPost.text}
            author={subPost.author}
            community={subPost.community}
            createdAt={subPost.createdAt}
            comments={subPost.children}
            isComment
          />
        ))}
      </div>
    </section>
  )

}