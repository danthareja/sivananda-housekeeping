import React from 'react';
import moment from 'moment';

export default rows => {
  return (
    <div style={{ position: 'relative', height: '40px' }}>
      <div style={{ position: 'absolute', left: '16px' }}>
        <h1 style={{ fontSize: '1.5em' }}>
          {moment().format('dddd, MMMM Do YYYY')}
        </h1>
      </div>
    </div>
  );
};
