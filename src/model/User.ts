import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  // type safety
  content: String;
  createdAt: Date;
}

// ------------------------------

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

export interface Users extends Document {
  // type safety
  username: String;
  email: String;
  password: String;
  verifyCode: String;
  verifyCodeExpiry: Date;
  isVerified: Boolean;
  isAcceptingMessage: Boolean;
  messages: Message[];
}

// ------------------------------

const UsersSchema: Schema<Users> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please Provide Valid Email"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  verifyCode: {
    type: String,
    required: true,
  },

  verifyCodeExpiry: {
    type: Date,
    required: true,
  },

  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },

  isAcceptingMessage: {
    type: Boolean,
    required: true,
    default: true,
  },

  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.Users as mongoose.Model<Users>) ||
  mongoose.model<Users>("Users", UsersSchema);

export default UserModel;
