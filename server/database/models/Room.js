const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  // Static data from csv file
  _id: Number, // Retreat Guru room id
  name: { type: String, required: true },
  lodgingId: { type: Number, required: true },
  lodgingName: { type: String, required: true },
  cleaningTime: { type: Number, required: true },
  cleaningCartCost: { type: Number, required: true },
  location: String,

  // Dynamic data
  isClean: { type: Boolean, required: true, default: false },
  lastCleanedAt: Date,
  lastCleanedBy: String,
});

RoomSchema.statics.reconcile = async function(proposed) {
  const existing = await this.find().exec();

  const toUpdate = _.intersectionBy(proposed, existing, '_id');
  const toCreate = _.differenceBy(proposed, existing, '_id');
  const toRemove = _.differenceBy(existing, proposed, '_id');

  for (let room of toUpdate) {
    const { nModified } = await this.updateOne({ _id: room.id }, room).exec();
    if (nModified === 1) {
      console.log(`updated room ${room._id} ${room.name}`);
    }
  }

  for (let room of toCreate) {
    console.log(`creating room ${room._id} ${room.name}`);
    await this.create(room);
  }

  for (let room of toRemove) {
    console.log(`removing room ${room._id} ${room.name}`);
    await room.remove();
  }
};

RoomSchema.statics.clean = async function(roomId, user) {
  const room = await this.findById(roomId).exec();

  room.isClean = !room.isClean;
  if (room.isClean) {
    room.lastCleanedAt = new Date();
    room.lastCleanedBy = user;
  }

  return room.save();
};

module.exports = mongoose.model('Room', RoomSchema);
