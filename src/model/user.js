const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const roles = ['user', 'admin'];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    address: String,
    phone: String,
    active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: 'user',
      enum: roles,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    this.password = bcrypt.hashSync(this.password);

    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();
    if (update.password) {
      update.password = bcrypt.hashSync(update.password);
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = model('User', userSchema);
