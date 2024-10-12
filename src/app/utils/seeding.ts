/* eslint-disable no-console */
import config from '../config';
import { POST_CATEGORY } from '../modules/postCategory/postCategory.constant';
import { PostCategory } from '../modules/postCategory/postCategory.model';
import { USER_ROLE, USER_STATUS } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';

export const seed = async () => {
  try {
    //at first check if the admin exist of not
    const admin = await User.findOne({
      role: USER_ROLE.ADMIN,
      email: config.admin_email,
      status: USER_STATUS.ACTIVE,
    });
    if (!admin) {
      console.log('Seeding started...');

      await User.create({
        name: 'Shohedul Islam',
        role: USER_ROLE.ADMIN,
        email: config.admin_email,
        password: config.admin_password,
        mobileNumber: config.admin_mobile_number,
        profilePhoto: config.admin_profile_photo,
        status: USER_STATUS.ACTIVE,
      });
      console.log('Admin created successfully...');
      console.log('Seeding completed...');
    }

    const category1 = await PostCategory.findOne({
      name: POST_CATEGORY.tips,
    })
    if( !category1){
      await PostCategory.create({
        name: POST_CATEGORY.tips,
        postCount: 0,
      })
      console.log('Post Category1 created successfully...');
    }
    const category2 = await PostCategory.findOne({
      name: POST_CATEGORY.stories,
    })
    if( !category2){
      await PostCategory.create({
        name: POST_CATEGORY.stories,
        postCount: 0,
      })
      console.log('Post Category2 created successfully...');
    }
  } catch (error) {
    console.log('Error in seeding', error);
  }
};
