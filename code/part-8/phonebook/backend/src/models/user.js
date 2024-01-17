import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

//TODO: use passwordHash
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
    },
  ],
});
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);
export { User };
