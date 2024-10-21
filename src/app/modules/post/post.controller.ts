import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';

const createPost = catchAsync(async (req, res) => {
  if (!req.files) {
    throw new AppError(400, 'Please upload an image');
  }

  const post = await PostServices.createPostIntoDB(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post created successfully',
    data: post,
  });
});

const getAllPostsForAdmin = catchAsync(async (req, res) => {
  const post = await PostServices.getAllPostsForAdminFromDB();
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: post,
  });
});

const getAllPosts = catchAsync(async (req, res) => {  
  const post = await PostServices.getAllPostsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: post,
  });
});

const getAllPostsWithScroll = catchAsync(async (req, res) => {  
  const post = await PostServices.getAllPostsWithScrollFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: post,
  });
});

const getSearchPostFromDB = catchAsync(async (req, res) => {
  const { searchTerm, limit } = req.query;

  const numberLimit = Number(limit) || 10;

  const result = await PostServices.getSearchPosts(
    // numberLimit
    // searchTerm as string
    req.query
  );  
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Items Retrieved Successfully',
    data: result,
  });
});

const getPremiumPosts = catchAsync(async (req, res) => {
  const post = await PostServices.getPremiumPostsFromDB();
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: post,
  });
});

const getPost = catchAsync(async (req, res) => {
  const postId = req.params.id; 
   
  const post = await PostServices.getPostFromDB(postId);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: post,
  });
});

const getMyPost = catchAsync(async (req, res) => {
  const postId = req.params.id;  
  const post = await PostServices.getMyPostFromDB(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: post,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedPost = await PostServices.updatePostInDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post updated successfully',
    data: updatedPost,
  });
});

const updatePostLikes = catchAsync(async (req, res) => {
  const { id } = req.params;  
  const updatedPost = await PostServices.updatePostLikesInDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post updated successfully',
    data: updatedPost,
  });
});



const updatePremiumPost = catchAsync(async (req, res) => {
  const { id } = req.params;    
  const updatedPost = await PostServices.updatePremiumPost(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Premium Post updated successfully',
    data: updatedPost,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  await PostServices.deletePostFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post deleted successfully',
    data: null,
  });
});

// comments operation

const addCommentInPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.addCommentsInToDB(id, req.body);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Added successfully',
    data: result,
  });
});

const getComments = catchAsync(async (req, res) => {
  const { id } = req.params;    
  const post = await PostServices.getComments(id);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comments retrieved successfully',
    data: post,
  });
});

const updateComments = catchAsync(async (req, res) => {
  const id = req.params.id; 
  const updatedPost = await PostServices.updateComments(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'comments updated successfully',
    data: updatedPost,
  });
});

const deleteComments = catchAsync(async (req, res) => {
  const id = req.params.id;
  
  await PostServices.deleteComments(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'comments deleted successfully',
    data: null,
  });
});

export const PostControllers = {
  createPost,
  getAllPosts,
  getAllPostsWithScroll,
  getAllPostsForAdmin,
  getSearchPostFromDB,
  getPost,
  getMyPost,
  updatePost,
  deletePost,
  updatePostLikes,
  getPremiumPosts,
  updatePremiumPost,
  addCommentInPost,
  getComments,
  updateComments,
  deleteComments,
};
