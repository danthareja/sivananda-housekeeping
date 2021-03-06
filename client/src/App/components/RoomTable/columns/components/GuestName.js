import React from 'react';
import { Icon } from 'antd';

const GuestName = ({ guest }) => (
  <span>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`https://sivanandabahamas.secure.retreat.guru/wp-admin/admin.php?registration=${
        guest.id
      }&page=registrations&action=edit`}
    >
      {guest.name}
    </a>
    {guest.isSpecial ? (
      <Icon
        type="star"
        theme="twoTone"
        twoToneColor="yellow"
        style={{ marginLeft: '2px' }}
      />
    ) : null}
  </span>
);

export default GuestName;
