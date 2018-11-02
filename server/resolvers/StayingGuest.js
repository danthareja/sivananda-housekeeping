module.exports = {
  StayingGuest: {
    id(guest, _, ctx) {
      return guest._id;
    },
    name(guest, _, ctx) {
      return guest.name;
    },
    isSpecial(guest, _, ctx) {
      return guest.isSpecial;
    },
  },
};
