import React from 'react';

export default function Button({ type, value, label, style, handle }) {
  const handleBtnClick = (e) => {
    handle(e, type);
  };

  return (
    <button className="btn" id={value} style={style} onClick={handleBtnClick}>
      {label}
    </button>
  );
}
