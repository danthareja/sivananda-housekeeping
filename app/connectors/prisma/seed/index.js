if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');
const axios = require('axios');


(async () => {
  const rooms = parseFixture('rooms.csv').map(transformRoomRow)
  for (let room of rooms) {
    console.log(await createRoom(room))
  }
})()

function parseFixture(filename) {
  return parse(fs.readFileSync(path.join(__dirname, 'fixtures', filename)), {
    columns: true
  });
}

function transformRoomRow(row) {
  return {
    retreatGuruId: parseInt(row.room_id),
    name: row.room_name,
    lodgingId: parseInt(row.primary_lodging_type_id),
    lodgingName: row.primary_lodging_type_name,
    location: row.location,
    cleaningTime: parseInt(row.cleaning_time),
    cartCost: parseInt(row.rooms_per_cart),
    dirty: false,
    givenKey: false,
  }
}

async function createRoom(data) {
  const query = `
    mutation CreateRoom($data: RoomCreateInput!) {
      createRoom(data:$data){
        name
      }
    }
  `

  const result = await axios.post(process.env.PRISMA_ENDPOINT, {
    query,
    variables: {
      data
    }
  })

  return result.data;
}