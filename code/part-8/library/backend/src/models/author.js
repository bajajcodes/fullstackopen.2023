import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
  bookCount: {
    type: Number,
    required: true,
    default: 0,
  },
});
authorSchema.plugin(uniqueValidator);

const Author = mongoose.model('Author', authorSchema);
export { Author };
