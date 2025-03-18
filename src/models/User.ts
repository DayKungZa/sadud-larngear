import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    yearOfStudy: { type: Number, required: true }, 
    dob: { type: Date, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
