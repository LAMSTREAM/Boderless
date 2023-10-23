'use server'

import {revalidatePath} from "next/cache";

import {connectToDB} from "@/src/lib/mongoose";
import Post from "@/src/lib/models/post.model";
import User from "@/src/lib/models/user.model";
import Community from "@/src/lib/models/community.model";

interface Params{
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}
export async function createPost({
  text,
  author,
  communityId,
  path
}: Params){
  await connectToDB();

  try {
    const communityIdObject = await Community.findOne(
      {id: communityId},
      {_id: 1}
    )

    const createPost = await Post.create({
      text,
      author,
      community: communityIdObject,
    })

    await User.findByIdAndUpdate(author, {
      $push: {post: createPost._id}
    })

    if(communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: {post: createPost._id}
      })
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
}

type commentParams = {
  postId: string;
  commentText: string;
  userId: string;
  path: string;
};
export async function createComment({
  postId,
  commentText,
  userId,
  path,
}: commentParams){
  await connectToDB();

  try {
    const originalPost = await Post.findById(postId);

    if(!originalPost){
      throw new Error(`Original Post not found!`);
    }

    const comment = new Post({
      text: commentText,
      author: userId,
      parentId: postId,
    });

    const savedComment = await comment.save();

    originalPost.children.push(savedComment._id);

    await originalPost.save();

    revalidatePath(path);

  } catch (error: any) {
    throw new Error(`Failed to add a comment: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20){
  await connectToDB();

  //calculate the number of posts to skip
  const skipPosts = (pageNumber - 1) * pageSize;

  // Fetch the posts which have no parents
  const postQuery = Post
    .find({parentId: { $in: [null, undefined]}})
    .sort({ createdAt: 'desc'})
    .skip(skipPosts)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
      path: 'community',
      model: Community,
    })
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: '_id name parentId image'
      }
    })

  const totalPostCount = await Post.countDocuments({
    parentId: { $in: [null, undefined]}
  });

  const posts = await postQuery.exec();

  const isNext = totalPostCount > skipPosts + posts.length;

  return {posts, isNext};
}

export async function fetchPostById(postId: string){
  await connectToDB();

  try {
    const post = await Post.findById(postId)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image'
      })
      .populate({
        path: 'community',
        model: Community,
        select: '_id id name image',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id name parentId image'
          },
          {
            path: 'children',
            model: Post,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image'
            }
          }
        ]
      }).exec();
    return post;
  } catch (error) {
    throw new Error(`Failed to fetch post id:${postId}`)
  }
}

export async function fetchAllChildPosts(postId: string): Promise<any[]> {
  const childPosts = await Post.find({ parentId: postId });

  const descendantPosts = [];
  for (const childPost of childPosts) {
    const descendants = await fetchAllChildPosts(childPost._id);
    descendantPosts.push(childPost, ...descendants);
  }

  return descendantPosts;
}

export async function deletePost(id: string, path: string): Promise<void> {
  try {
    await connectToDB();

    // Find the post to be deleted (the main post)
    const mainPost = await Post.findById(id).populate("author communities");

    if (!mainPost) {
      throw new Error("Post not found");
    }

    // Fetch all child posts and their descendants recursively
    const descendantPosts = await fetchAllChildPosts(id);

    // Get all descendant post IDs including the main post ID and child thread IDs
    const descendantPostIds = [
      id,
      ...descendantPosts.map((post) => post._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantPosts.map((post) => post.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainPost.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantPosts.map((post) => post.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainPost.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child posts and their descendants
    await Post.deleteMany({ _id: { $in: descendantPostIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { post: { $in: descendantPostIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { post: { $in: descendantPostIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}

