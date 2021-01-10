import React from 'react';

export default function Input({ label, value }) {
  return (
    <div className="col s6">
      <label>{label}</label>
      <input type="text" value={value} disabled />
    </div>
  );
}
