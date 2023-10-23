
import {currentUser} from "@clerk/nextjs";
import {redirect} from "next/navigation";

import {fetchUser} from "@/src/lib/actions/user.action";
import {fetchPosts} from "@/src/lib/actions/post.actions";
import PostCard from "@/src/components/cards/PostCard";

export default async function Home() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPosts(1,30)

  return (
    <>
      <h1 className={`head-text text-left`}>Home</h1>

      <section className={`mt-9 flex flex-col gap-10`}>
        {result.posts.length === 0 ? (
          <p className={`no-result`}>No Posts</p>
        ) : (
          <>
            {result.posts.map((post: any)=> (
              <PostCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}
