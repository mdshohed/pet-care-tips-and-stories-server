import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { ProfileController } from './profile.controller';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';
import validateImageFileRequest from '../../middlewares/validateImageFileRequest';
import { ImageFilesArrayZodSchema } from '../../zod/image.validation';

const router = express.Router();

router.get(
    '/',
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    ProfileController.getMyProfile
);

router.put(
    '/',
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    multerUpload.single('profilePhoto'),   
    parseBody,
    ProfileController.updateMyProfile
)

export const ProfileRoutes = router;
