import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    unique: true,
  },
  phone: {
    type: String,
    minlength: 5,
  },
  street: {
    type: String,
    required: true,
    minlength: 5,
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
  },
  friendOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

personSchema.plugin(uniqueValidator);

const Person = mongoose.model('Person', personSchema);
export { Person };
