const _ = require('lodash');
const { Room } = require('../models');
const loadFixture = require('./fixtures');

const seed = async () => {
  console.log('seeding from fixtures');

  const rooms = await loadFixture('rooms');
  await Room.reconcile(
    rooms.map(room => ({
      _id: room.room_id,
      name: room.room_name,
      lodgingId: room.lodging_id,
      lodgingName: room.lodging_name,
      cleaningTime: room.cleaning_time,
      cleaningCartCost: room.cleaning_cart_cost,
      location: room.location,
    }))
  );

  console.log(`done seeding from fixtures`);
};

module.exports = seed;
