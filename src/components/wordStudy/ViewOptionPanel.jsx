import React from 'react';

export default function FilterPanel({handleCheckChange}) {
  const checkBoxItems = [
    {name: '한자 가리기', value: 'C'},
    {name: '병음 가리기', value: 'P'},
    {name: '뜻 가리기', value: 'M'},
  ]

  return (
    <div className="view-option">
      {checkBoxItems.map(item => (
        <div key={item.value}>
          <input
            type="checkbox"
            value={item.value}
            onChange={handleCheckChange}
          />
          {item.name}
        </div>
      ))}
    </div>
  );
}
