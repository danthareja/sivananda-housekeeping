const _ = require('lodash');
const { Room } = require('../models');
const loadData = require('./data');

const seed = async () => {
  console.log('seeding rooms');
  const existing = await Room.find();
  const proposed = transform(await loadData('rooms'));

  const toUpdate = _.intersectionBy(existing, proposed, 'id');
  const toCreate = _.differenceBy(proposed, existing, 'id');
  const toRemove = _.differenceBy(existing, proposed, 'id');

  for (let room of toUpdate) {
    const { nModified } = await room.updateOne(_.omit(room, 'id')).exec();
    if (nModified === 1) {
      console.log(`updated room ${room.id} ${room.name}`);
    }
  }

  for (let room of toCreate) {
    await Room.create(
      _.assign(room, {
        isClean: false,
      })
    );
    console.log(`created room ${room.id} ${room.name}`);
  }

  for (let room of toRemove) {
    await room.remove();
    console.log(`removed room ${room.id} ${room.name}`);
  }

  console.log(`done seeding rooms`);
};

const transform = rows =>
  rows.map(row => ({
    id: row.room_id,
    name: row.room_name,
    lodgingId: row.lodging_id,
    lodgingName: row.lodging_name,
    cleaningTime: row.cleaning_time,
    cleaningCartCost: row.cleaning_cart_cost,
    location: row.location,
  }));

module.exports = seed;
