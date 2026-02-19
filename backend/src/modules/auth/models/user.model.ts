import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export type UserRole = "ADMIN" | "USER"

interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  role: UserRole
  companyId: mongoose.Types.ObjectId
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER"
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    }
  },
  { timestamps: true }
)

// Hash automático antes de salvar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model<IUser>("User", userSchema)
export default User
