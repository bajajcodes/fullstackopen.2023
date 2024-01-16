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
});

personSchema.plugin(uniqueValidator);

const PersonModel = mongoose.model('Person', personSchema);
export { PersonModel };
