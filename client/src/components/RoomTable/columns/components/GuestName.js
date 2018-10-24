import React from 'react';
import { Icon } from 'antd';

const GuestName = ({ guest }) => (
  <div>
    <a target="_blank" href={`https://sivanandabahamas.secure.retreat.guru/wp-admin/admin.php?registration=${guest.id}&page=registrations&action=edit`}>
      {guest.name}
    </a>
    { guest.isSpecial ? <Icon type="star" theme="twoTone" twoToneColor="yellow"/> : null }
  </div>
)

export default GuestName