const {Schema, model} = require ('mongoose');
const {AvatarGenerator} = require ('random-avatar-generator');
const generator = new AvatarGenerator ();

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

const userSchema = Schema ({
  _id: Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: emailRegex,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    default: 'unknown user',
  },
  avatar: {
    type: String,
    required: true,
    default: generator.generateRandomAvatar (),
  },
  role: {
    type: String,
    require: true,
    enum: ['saler', 'admin', 'client', 'shipper'],
    default: 'client',
  },
  zipCode: {
    type: String,
  },
  isActived: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
    unique: true,
    match: phoneRegex,
  },
  cardNumber: {
    type: String,
    unique: true,
  },
  addressList: [
    {
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
      street: {
        type: String,
      },
      label: {
        type: String,
      },
    },
  ],
});

module.exports = model ('User', userSchema);
