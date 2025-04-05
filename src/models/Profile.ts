import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bio: string;
  githubId: string;
  technicalBackground: string;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    bio: {
      type: String,
      required: true,
      trim: true
    },
    githubId: {
      type: String,
      required: true,
      trim: true
    },
    technicalBackground: {
      type: String,
      required: true,
      trim: true
    },
    skills: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true
  }
);

// Create and export the Profile model
export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema); 