import { count } from 'console';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { TImageFiles } from '../../interfaces/image.interface';
// import { addDocumentToIndex, deleteDocumentFromIndex } from '../../utils/meilisearch';
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

  // await addDocumentToIndex(result, 'posts');
  return result;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  query = (await SearchPostByUserQueryMaker(query)) || query;

  // Date range search
  query = (await SearchPostByDateRangeQueryMaker(query)) || query;

  query = (await SearchPostByCategoryQueryMaker(query)) || query;

  const postQuery = new QueryBuilder(
    Post.find().populate('user').populate('category'),
    query
  )
    .filter()
    .search(PostSearchableFields)
    .sort()
    // .paginate()
    .fields();

  const result = await postQuery.modelQuery;

  return result;
};

const getPremiumPostsFromDB = async () => {
  
  const result = await Post.find( { isPremium: true} )
    .populate('user')
    .populate('category');
  
  return result;
};

const getPostFromDB = async (postId: string) => {
  
  const result = await Post.findById(postId)
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

import { ObjectId, Types } from 'mongoose';

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

  // if (result) {
  //   await addDocumentToIndex(result, 'posts');
  // } else {
  //   throw new Error(`Post with ID ${postId} not found.`);
  // }

  return result;
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
  updatePostInDB,
  deletePostFromDB,
  updatePostLikesInDB,
  getPremiumPostsFromDB, 
};
