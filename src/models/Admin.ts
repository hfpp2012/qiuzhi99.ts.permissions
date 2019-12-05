import jwt from "jsonwebtoken";
import { Schema, model, Model, Document } from "mongoose";
import { AdminJwtPayload } from "../types/Jwt";
import config from "../config/config";
import { IRoleDocument } from "./Role";
// @ts-ignore
import uniqueValidator from "mongoose-unique-validator";
// @ts-ignore
import exists from "mongoose-exists";

// enum Role {
//   admin = "admin",
//   basic = "basic",
//   coder = "coder"
// }

export interface IAdminDocument extends Document {
  username: string;
  password: string;
  isAdmin: boolean;
  role: IRoleDocument["_id"];
  // role: Role;
  generateToken: () => string;
}

const adminSchema: Schema = new Schema(
  {
    username: { type: String, unique: true, trim: true },
    password: String,
    isAdmin: { type: Boolean, default: false },
    // role: { type: String, default: "basic" }
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      exists: true
    }
  },
  { timestamps: true }
);

adminSchema.methods.generateToken = function(): string {
  const payload: AdminJwtPayload = { id: this.id };
  return jwt.sign(payload, config.auth.adminSecretKey, {
    expiresIn: "5d"
  });
};

adminSchema.set("toJSON", {
  transform: function(_doc, ret) {
    delete ret["password"];
    return ret;
  }
});

adminSchema.plugin(uniqueValidator);
adminSchema.plugin(exists);

const Admin: Model<IAdminDocument> = model<IAdminDocument>(
  "Admin",
  adminSchema
);

export default Admin;
