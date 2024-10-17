import express from 'express';
import { multerUpload } from '../../config/multer.config';

import validateImageFileRequest from '../../middlewares/validateImageFileRequest';
import validateRequest from '../../middlewares/validateRequest';
import { ImageFilesArrayZodSchema } from '../../zod/image.validation';
import { PostControllers } from './post.controller';
import { PostValidation } from './post.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { parseBody } from '../../middlewares/bodyParser';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.USER),
  multerUpload.fields([{ name: 'itemImages' }]), 
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(PostValidation.createPostValidationSchema),
  PostControllers.createPost
);

router.get('/admin', PostControllers.getAllPostsForAdmin);
router.get('/', PostControllers.getAllPosts);
router.get('/search-post', PostControllers.getSearchPostFromDB);
router.get('/premium', PostControllers.getPremiumPosts);

router.get('/:id', PostControllers.getPost);
router.get('/me/:id', PostControllers.getMyPost);

router.put(
  '/:id',
  auth(USER_ROLE.USER),
  validateRequest(PostValidation.updatePostValidationSchema),
  PostControllers.updatePost
);

router.put(
  '/likes/:id',
  auth(USER_ROLE.USER),
  PostControllers.updatePostLikes
);

router.put(
  '/comments/:id',
  auth(USER_ROLE.USER),
  PostControllers.addCommentInPost
);

router.put('/premium/:id', PostControllers.updatePremiumPost);


router.delete('/:id', auth(USER_ROLE.USER), PostControllers.deletePost);

export const PostRoutes = router;
