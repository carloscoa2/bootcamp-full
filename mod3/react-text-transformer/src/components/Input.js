import React from 'react';

export default function Input({ inputId, label, value, copy }) {
  const copyFunc = (inputId) => {
    copy(inputId);
  };

  return (
    <div className="col s6">
      <label>{label}</label>
      <div className="row">
        <div className="col s11">
          <input id={inputId} type="text" value={value} readOnly />
        </div>
        <div className="col s1">
          <i
            style={styles.pointer}
            className="material-icons"
            onClick={() => copyFunc(inputId)}
          >
            content_copy
          </i>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pointer: {
    cursor: 'pointer',
  },
};
