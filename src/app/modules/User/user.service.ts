import { Types } from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { UserSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);

  return user;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  // const users = new QueryBuilder(User.find(), query)
  //   .fields()
  //   .paginate()
  //   .sort()
  //   .filter()
  //   .search(UserSearchableFields);

  // const result = await users.modelQuery;
  const result = await User.find(); 

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id)
  .populate('follower')
  .populate('following');
  return user;
};

const updateFriendConnectionInToDB = async (id: string, payload: { connectUser: string}) => {
  
  const firstUserId = new Types.ObjectId(id)
  const secondUserId = new Types.ObjectId(payload.connectUser)

  const user = await User.findById(id);
  if(!user){
    throw new Error(`User ${id} not found.`);
  }
  const secondUser = await User.findById( payload.connectUser);
  if(!secondUser){
    throw new Error(`Second User ${payload.connectUser} not found.`);
  }
  const followingUser = user.following || [];  

  // const hasUserLiked = user.following?.some((id: any) => id.equals(secondUserId));

  let followingData;
  if (!user.following?.some((id: any) => id.equals(secondUserId))) {
    followingData = [...followingUser, secondUserId]; 
  } else {
    followingData = followingUser.filter((id: any) => !id.equals(secondUserId));
  }

  // follower part

  const followerUser = secondUser.follower || [];  
  let followerData;
  if (! secondUser.follower?.some((id: any) => id.equals(firstUserId))) {
    followerData = [...followerUser, firstUserId]; 
  } else {
    followerData = followerUser.filter((id: any) => !id.equals(firstUserId));
  }

  const success = await User.findByIdAndUpdate(id, { following: followingData}, { new: true });
  if(!success){
    throw new Error(`Following updated Error!`);
  }
  const result = await User.findByIdAndUpdate(payload.connectUser, { follower: followerData}, { new: true });
  return result;
};

export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateFriendConnectionInToDB,
};
