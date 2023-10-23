'use server'

import {revalidatePath} from "next/cache";

import {connectToDB} from "@/src/lib/mongoose";
import User from "@/src/lib/models/user.model";
import Post from "@/src/lib/models/post.model";
import {FilterQuery, SortOrder} from "mongoose";
import Community from "@/src/lib/models/community.model";

interface Params {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string,
}

async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  await connectToDB();

  try {
    await User.findOneAndUpdate(
      {id: userId},
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {upsert: true}
    );

    if(path === `/profile/edit`){
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

async function fetchUser(userId: string) {
  try {
    await connectToDB()

    return await User
      .findOne({id: userId})
      .populate({
        path: 'communities',
        model: Community,
      });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

async function fetchUserPosts(userId: string){
  await connectToDB();

  try {
    const posts = await User.findOne({id: userId})
      .populate({
        path: 'post',
        model: Post,
        populate: [
          {
            path: 'author',
            model: User,
            select: 'id name image'
          },
          {
            path: 'community',
            model: Community,
            select: 'name id image _id'
          }
        ]
      });
    return posts;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

type fetUserParams = {
  userId: string;
  searchString: string;
  pageNumber: number;
  pageSize: number;
  sortBy: SortOrder;
}

async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc'
} : fetUserParams){
  await connectToDB();

  try {
    const skipAmount = (pageNumber -1) * pageSize;
    const regex = new RegExp(searchString, 'i');

    const query: FilterQuery<typeof User> = {id: {$ne: userId}}
    if(searchString.trim() !== ''){
      query.$or = [
        {username: {$regex: regex}},
        {name: {$regex: regex}}
      ]
    }
    const sortOptions = {createdAt: sortBy};

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const users = await usersQuery.exec();

    const totalUsersCount = await User.countDocuments(query);
    const isNext = totalUsersCount > skipAmount + users.length;

    return {users, isNext};
  } catch (error: any) {
    throw new Error(`Failed to fetch Users: ${error.message}`)
  }
}

async function getActivities(userId: string){
  await connectToDB();

  try {
    const userPosts = await Post.find({author: userId});

    const subPosts = userPosts.reduce((acc, userPost) => {
      return acc.concat(userPost.children);
    }, [])

    const replies = await Post.find({
      _id: {$in: subPosts},
      author: {$ne:userId}
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id'
    })

    return replies;
  } catch (error: any){
    throw new Error(`Failed to fetch activity: ${error.message}`);
  }
}

export {updateUser, fetchUser, fetchUserPosts, fetchUsers, getActivities};