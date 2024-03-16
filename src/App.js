import { useState } from 'react';

// const initialItems = [
//   { id: 1, description: 'Passports', quantity: 2, packed: false },
//   { id: 2, description: 'Socks', quantity: 12, packed: true },
//   { id: 3, description: 'charger', quantity: 1, packed: false },
// ];

export default function App() {
  const [items, setItems] = useState([]);
  function HandleItems(item) {
    setItems((items) => [...items, item]);
  }
  function HandleDeleteItems(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function HandleToggleItems(id) {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function handleClearList() {
    const confirm = window.confirm('Are you sure you want to clear the list?');
    if (confirm) setItems([]);
  }
  return (
    <div className='app'>
      <Logo />
      <Form onAdditem={HandleItems} />
      <PackingList
        items={items}
        onDeleteItem={HandleDeleteItems}
        onUpdateItem={HandleToggleItems}
        handleClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}
function Logo() {
  return (
    <div>
      <h1>🌴Far Away💼</h1>
    </div>
  );
}

function Form({ onAdditem }) {
  const [description, setDescription] = useState('');
  function HandleSubmite(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() };
    console.log('newItem', newItem);
    onAdditem(newItem);
    setDescription('');
    setQuantity(1);
  }
  const [quantity, setQuantity] = useState(1);
  return (
    <form className='add-form' onSubmit={HandleSubmite}>
      <h3>What do you need for your 😍 trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num}>{num}</option>
        ))}
      </select>
      <input
        type='text'
        placeholder='item..'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type='submit'>Add Item</button>
    </form>
  );
}
function PackingList({ items, onDeleteItem, onUpdateItem, handleClearList }) {
  const [sortBy, setSortBy] = useState('input');
  let sortedItems;

  if (sortBy === 'input') {
    sortedItems = items;
  } else if (sortBy === 'description') {
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  } else if (sortBy === 'packed') {
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  }

  return (
    <div className='list'>
      <ul>
        {sortedItems.length > 0
          ? sortedItems.map((item) => (
              <Item
                item={item}
                key={item.id}
                ondeleteItem={onDeleteItem}
                onAdditem={onUpdateItem}
              />
            ))
          : ''}
      </ul>
      <div className='actions'>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value='input'>Sort by input order </option>
          <option value='description'>Sort by description</option>
          <option value='packed'>Sort by packed status</option>
        </select>
        <button onClick={handleClearList}>Clear List</button>
      </div>
    </div>
  );
}
function Item({ item, ondeleteItem, onAdditem }) {
  return (
    <li>
      <input
        type='checkbox'
        value={item.packed}
        onChange={() => onAdditem(item.id)}
      />
      <span style={item.packed ? { textDecoration: 'line-through' } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => ondeleteItem(item.id)}>❌</button>
    </li>
  );
}
function Stats({ items }) {
  if (!items.length)
    return (
      <footer className='stats'>
        <em> Start adding some items for your trip </em>
      </footer>
    );
  const numItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentage = (packedItems / numItems) * 100;

  return (
    <footer className='stats'>
      {percentage === 100 ? (
        <em>you have packed everything, All set for the trip ✈️ </em>
      ) : (
        <em>
          You have {numItems} items on your list, and you already packed{' '}
          {packedItems} items {percentage}%
        </em>
      )}
    </footer>
  );
}
