import React from 'react';

export default function Todo({ date, description, style }) {
  return (
    <li style={style}>
      <span>{date}</span> - {description}
    </li>
  );
}
