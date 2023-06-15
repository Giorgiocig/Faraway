import React, { useState } from "react";
import "./App.css";

type Item = {
  id: number;
  description: string;
  quantity: number;
  packed: boolean;
};

let initialItems: Item[] = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: true },
];

interface FormProps {
  handleAddItem: (item: Item) => void;
}

export function App() {
  const [itemList, setItemList] = useState<Item[]>([]);

  function handleDeleteItem(id: number) {
    setItemList(itemList.filter((el) => el.id !== id));
  }

  function handleAddItem(item: Item) {
    setItemList((prev) => [...prev, item]);
  }

  function handleUpdate(id: number) {
    setItemList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearList() {
    setItemList([]);
  }

  return (
    <div>
      <Logo />
      <Form handleAddItem={handleAddItem} />
      <PackingList
        itemList={itemList}
        handleDeleteItem={handleDeleteItem}
        handleUpdate={handleUpdate}
        handleClearList={handleClearList}
      />
      <Stats itemList={itemList} />
    </div>
  );
}

export default App;

export function Logo() {
  return <h1> Far Away </h1>;
}

export function Form({ handleAddItem }: FormProps) {
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<string | number>(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newItem = {
      description,
      quantity: Number(quantity),
      packed: false,
      id: Date.now(),
    };
    setDescription("");
    setQuantity(1);
    handleAddItem(newItem);
  }
  //()=>handleSubmit no: Questo solo per setState nell hook useState e per l onChange(e)=>
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>what do you need for the trip?</h3>
      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
        {Array.from({ length: 20 }, (curr, idx) => idx + 1).map(
          (
            num,
            idx //Array.from crea un array di 20 elementi partendo da idx+1 su cui poi loopiamo per creare le option
          ) => (
            <option value={num} key={idx}>
              {num}
            </option>
          )
        )}
      </select>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)} //e=event. We are listening for the event e. e.target = input field controlled and value is the value in it.
      ></input>
      <button>Add</button>
    </form>
  );
}

export function PackingList({
  itemList,
  handleDeleteItem,
  handleUpdate,
  handleClearList,
}: {
  itemList: Item[];
  handleDeleteItem: (id: number) => void;
  handleUpdate: (id: number) => void;
  handleClearList: () => void;
}) {
  const [sortBy, setSortBy] = useState<string>("input");
  //to sort we use derived state. We will not manipulate the original array. we will create a new item and then it will be sorted following criteria
  let sortedItem: Item[] = [];
  if (sortBy === "input") sortedItem = itemList;

  if (sortBy === "description")
    sortedItem = itemList
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed") {
    sortedItem = itemList
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed)); //packed is a booled and it is converted to a Number. CONVERTING A BOOLEAN IN A NUMBER IT CONVERTS false->0 and True->1
  }

  return (
    <div className="list">
      <ul>
        {sortedItem.map((el: any, idx: number) => (
          <Item
            key={idx}
            item={el}
            handleDeleteItem={handleDeleteItem}
            handleUpdate={handleUpdate}
          />
        ))}
      </ul>
      <div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">sort by input order</option>
          <option value="description">sort by description</option>
          <option value="packed">sort by packed status</option>
        </select>
        <button onClick={() => handleClearList()}>Clear List</button>
      </div>
    </div>
  );
}

function Item({
  item,
  handleDeleteItem,
  handleUpdate,
}: {
  item: Item;
  handleDeleteItem: (id: number) => void;
  handleUpdate: (id: number) => void;
}) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed ? "true" : "false"}
        onChange={() => handleUpdate(item.id)}
      />
      <span className={item.packed ? "text-strike" : ""}>
        {item.quantity}
        {item.description}
      </span>
      <button onClick={() => handleDeleteItem(item.id)}>❌</button>
    </li>
  );
}

export function Stats({ itemList }: { itemList: Item[] }) {
  //early return to avoid the calculation of derived states
  if (!itemList.length) {
    return <p className="stats">you have nothing to pack</p>;
  }
  //derived values
  const numberOfItem: number = itemList.length;
  const numberOfPacked = itemList.reduce(
    (acc, curr) => (curr.packed === true ? acc + 1 : acc),
    0
  );
  const percentage = Math.round((numberOfPacked / numberOfItem) * 100);

  return (
    <footer className="stats">
      {percentage === 100
        ? "you are ready to go"
        : `you have ${numberOfPacked} items on your list and you already pack
      ${percentage}`}
    </footer>
  );
}
