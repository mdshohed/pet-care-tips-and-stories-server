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
  payload.likes = {count: 0, user: [], upVote: [], downVote: []}; 
  payload.comments = { count: 0, comment: []}
  const result = await Post.create(payload);
  return result;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  console.log("value1", query);

  query = (await SearchPostByUserQueryMaker(query)) || query;
  // Date range search
  query = (await SearchPostByDateRangeQueryMaker(query)) || query;

  query = (await SearchPostByCategoryQueryMaker(query)) || query;
  console.log("query", query);

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
  // console.log("value", query);

  const newResult = result.filter((post)=>post?.isPremium===false||post.premiumDetails?.isPending===false)

  return newResult;
};
const getAllPostsForAdminFromDB = async () => {
  const result = await Post.find().populate('user').populate('category').populate('comments.comment.user')
  return result;
};

const getSearchPosts = async (query: Record<string, unknown>) => {
  
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
  .populate('user').populate('category').populate('comments.comment.user')
  return result;
};

const getPostFromDB = async (id: string) => {
  const result = await Post.findById(id).populate('user').populate('category').populate('comments.comment.user');
  return result;
};

const getMyPostFromDB = async (id: string) => {
  const result = await Post.find( {user: id}).populate('user').populate('category').populate('comments.comment.user');
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
  
  if(post.premiumDetails){
     updatePost = {
      isPending: !post.premiumDetails?.isPending, 
      subscriptionFee: post.premiumDetails.subscriptionFee,
      subscribedUser: post.premiumDetails?.subscribedUser
    }
  }
  
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

const updatePostLikesInDBX = async (postId: string, payload: { userId: string, type:string }) => {
  const userId = new Types.ObjectId(payload.userId);  
  console.log("type", payload.type);
  
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

const updatePostLikesInDB = async (postId: string, payload: { userId: string, type:string }) => {
  const userId = new Types.ObjectId(payload.userId);  
  console.log("type", payload.type);
  
  const findPost = await Post.findById(postId);
  if (!findPost) {
    throw new Error(`Post with ID ${postId} not found.`);
  }
  const findUser = await User.findById(payload.userId);
  if (!findUser) {
    throw new Error(`User with ID ${postId} not found.`);
  }

  const upVote = findPost.likes?.upVote || [];  
  const downVote = findPost.likes?.downVote || [];  
  
  const hasUserUpVote = upVote.some((id: any) => id.equals(userId));
  const hasUserDownVote = downVote.some((id: any) => id.equals(userId));
  
  let updateData;
  if(hasUserDownVote||hasUserUpVote){
    if(hasUserUpVote){
      const newUpVote = upVote.filter((id: any) => id.toString() !== userId.toString());
      if(payload.type==="Up"){
        updateData = {
          'likes.count': findPost.likes!.count - 1,
          'likes.upVote': [...newUpVote], 
          'likes.downVote': [...downVote], 
        }
      }
      else{
        updateData = {
          'likes.count': findPost.likes!.count - 2,
          'likes.upVote': [...newUpVote], 
          'likes.downVote': [...downVote, userId], 
        }
      }
    }
    else{
      const newDownVote = downVote.filter((id: any) => id.toString() !== userId.toString());
      if(payload.type==="Down"){
        updateData = {
          'likes.count': findPost.likes!.count + 1,
          'likes.upVote': [...upVote], 
          'likes.downVote': [...newDownVote], 
        }
      }
      else{
        updateData = {
          'likes.count': findPost.likes!.count + 2,
          'likes.upVote': [...upVote, userId], 
          'likes.downVote': [...newDownVote], 
        }
      }
    }
  }
  else{
    if(payload.type==="Up"){
      updateData = {
        'likes.count': findPost.likes!.count + 1,
        'likes.upVote': [...upVote, userId], 
        'likes.downVote': [...downVote], 
      }
    }
    else{
      updateData = {
        'likes.count': findPost.likes!.count - 1,
        'likes.upVote': [...upVote], 
        'likes.downVote': [...downVote, userId], 
      }
    }
  }
  const result = await Post.findByIdAndUpdate(postId, updateData, { new: true });
  console.log("vote", updateData, result, upVote, downVote);
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
  getAllPostsForAdminFromDB,
  getPostFromDB,
  getMyPostFromDB,
  updatePostInDB,
  deletePostFromDB,
  updatePostLikesInDB,
  addCommentsInToDB,
  getPremiumPostsFromDB, 
  updatePremiumPost,
  getSearchPosts,
};
