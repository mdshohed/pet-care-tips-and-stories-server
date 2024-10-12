import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { PostCategory } from './postCategory.model';
import { PostCategoryDocument, TPostCategory } from './postCategory.interface';
import { postCategorySearchableFields } from './postCategory.constant';


const createPostCategory = async (postCategory: TPostCategory) => {
  const result = await PostCategory.create(postCategory);
  return result;
};

const getAllPostCategories = async (query: Record<string, unknown>) => {
  const posts = new QueryBuilder(PostCategory.find({ isDeleted: false }), query)
    .search(postCategorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await posts.modelQuery;
  return result;
};

const getPostCategoryById = async (
  categoryId: string
): Promise<PostCategoryDocument | null> => {
  const isCategoryExists = await PostCategory.findOne({
    _id: categoryId,
    isDeleted: false,
  });

  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post Category not found!');
  }

  const category = await PostCategory.findOne({
    _id: categoryId,
    isDeleted: false,
  }).exec();
  return category;
};

const updatePostCategory = async (
  id: string,
  updateData: Partial<TPostCategory>
) => {
  const isCategoryExists = await PostCategory.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post Category not found!');
  }

  const category = await PostCategory.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  return category;
};

const deletePostCategory = async (id: string) => {
  const isCategoryExists = await PostCategory.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post Category not found!');
  }

  const category = await PostCategory.findByIdAndDelete(id);
  return category;
};

export const PostCategoryServices = {
  createPostCategory,
  getAllPostCategories,
  getPostCategoryById,
  updatePostCategory,
  deletePostCategory,
};
