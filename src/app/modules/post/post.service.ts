import { count } from 'console';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { TImageFiles } from '../../interfaces/image.interface';
import { PostSearchableFields } from './post.constant';

import { TPost } from './post.interface';
import { Post } from './post.model';
import {
  SearchPostByCategoryQueryMaker,
  SearchPostByDateRangeQueryMaker,
  SearchPostByUserQueryMaker,
} from './post.utils';

const createPostIntoDB = async (payload: TPost, images: TImageFiles) => {
  const { itemImages } = images;
  payload.images = itemImages.map((image) => image.path);
  payload.likes = {count: 0, user: []}; 
  payload.comments = { count: 0, comment: []}
  const result = await Post.create(payload);
  return result;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  query = (await SearchPostByUserQueryMaker(query)) || query;
  // Date range search
  query = (await SearchPostByDateRangeQueryMaker(query)) || query;

  query = (await SearchPostByCategoryQueryMaker(query)) || query;

  const itemQuery = new QueryBuilder(
    Post.find().populate('user').populate('category').populate('comments.comment.user'),
    query
  )
    .filter()
    .search(PostSearchableFields)
    .sort()
    // .paginate()
    .fields();

  const result = await itemQuery.modelQuery;

  // const result = await Post.find({
  //   $or: [
  //     { isPremium: false },
  //     { isPremium: true, 'premiumDetails.isPending': false }
  //   ]
  // })
  //   .populate('user')
  //   .populate('category');

  const newResult = result.filter((post)=>post.premiumDetails?.isPending !==false)
  return newResult;
};

const getPremiumPostsFromDB = async () => {
  
  const result = await Post.find( { isPremium: true} )
    .populate('user')
    .populate('category');
  
  return result;
};

const getPostFromDB = async (id: string) => {
  
  const result = await Post.findById(id)
    .populate('user')
    .populate('category');
  return result;
};

const getMyPostFromDB = async (id: string) => {
  const result = await Post.findById( {user: id})
    .populate('user')
    .populate('category');
  return result;
};

const updatePostInDB = async (postId: string, payload: TPost) => {
  const result = await Post.findByIdAndUpdate(postId, payload, { new: true });
  // if (result) {
  //   await addDocumentToIndex(result, 'posts');
  // } else {
  //   throw new Error(`Post with ID ${postId} not found.`);
  // }
  if(!result){
    throw new Error(`Post with ID ${postId} not found.`);
  }
  return result;
};

const updatePremiumPost = async (params: string) => {
  const post = await Post.findById(params);
  if (!post) {
    throw new Error(`Post with Id ${params} not found!`);
  }
  let updatePost = post?.premiumDetails;
  console.log("update", updatePost);
  
  if(post.premiumDetails){
     updatePost = {
      isPending: !post.premiumDetails?.isPending, 
      subscriptionFee: post.premiumDetails.subscriptionFee,
      subscribedUser: post.premiumDetails?.subscribedUser
    }
  }
  console.log("id", updatePost);
  
  const result = await Post.findByIdAndUpdate(
    params, 
    { premiumDetails: updatePost }, 
    { new: true }
  );

  if (!result) {
    throw new Error(`Post update Error.`);
  }

  return result;
};


import { ObjectId, Types } from 'mongoose';
import { User } from '../User/user.model';

const updatePostLikesInDB = async (postId: string, payload: { userId: string }) => {
  const userId = new Types.ObjectId(payload.userId);  
  

  const findPost = await Post.findById(postId);
  if (!findPost) {
    throw new Error(`Post with ID ${postId} not found.`);
  }

  const findPostUser = findPost.likes?.user || [];  

  const hasUserLiked = findPostUser.some((id: any) => id.equals(userId));

  let updateData;
  if (!hasUserLiked) {
    updateData = {
      'likes.count': findPost.likes!.count + 1,
      'likes.user': [...findPostUser, userId], 
    };
  } else {
    updateData = {
      'likes.count': findPost.likes!.count - 1,
      'likes.user': findPostUser.filter((id: any) => !id.equals(userId)), 
    };
  }

  const result = await Post.findByIdAndUpdate(postId, updateData, { new: true });
  return result;
};

const addCommentsInToDB = async (postId: string, payload: { userId: string, text: string, postId: string }) => {
  try {
    const userId = new Types.ObjectId(payload.userId);

    // Aggregate pipeline for the update
    const result = await Post.updateOne(
      { _id: new Types.ObjectId(postId) }, // Match the post by postId
      [
        {
          $set: {
            'comments.comment': {
              $concatArrays: [
                {
                  $ifNull: ['$comments.comment', []], 
                },
                [{ text: payload.text, user: userId }], 
              ],
            },
            // Increment the comment count
            'comments.count': { $add: [{ $ifNull: ['$comments.count', 0] }, 1] },
          },
        },
      ]
    );

    if (result.matchedCount === 0) {
      throw new Error(`Post with ID ${postId} not found.`);
    }

    console.log("Updated Post Result:", result);

    return result;
  } catch (error) {
    console.error('Error updating comments:', error);
    throw error;
  }
};




const deletePostFromDB = async (postId: string) => {
  const result = await Post.findByIdAndDelete(postId);
  // const deletedPostId = result?._id;
  // if (deletedPostId) {
  //   await deleteDocumentFromIndex('posts', deletedPostId.toString());
  // }

  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostFromDB,
  getMyPostFromDB,
  updatePostInDB,
  deletePostFromDB,
  updatePostLikesInDB,
  addCommentsInToDB,
  getPremiumPostsFromDB, 
  updatePremiumPost,
};
