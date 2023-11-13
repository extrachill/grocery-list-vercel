import { useState, useEffect, useRef } from "react";
import { MdDeleteForever as BinIcon, MdEdit as EditIcon } from "react-icons/md";

function getStorage() {
  let list = localStorage.getItem("list");

  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
}

export default function App() {
  const [itemName, setItemName] = useState("");
  const [list, setList] = useState(getStorage());
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");

  const inputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    if (!editMode) {
      const id = crypto.randomUUID();
      const item = { name: itemName, id };
      setList((list) => [...list, item]);
      setItemName("");
    } else {
      setList((list) =>
        list.map((item) => {
          const id = item.id;
          return item.id === editId ? { name: itemName, id } : item;
        })
      );
      setEditMode(false);
      setItemName("");
    }
    console.log(list);
    console.log(itemName);
  }

  function clear() {
    setList([]);
    localStorage.removeItem("list");
  }

  useEffect(
    function () {
      localStorage.setItem("list", JSON.stringify(list));
    },
    [list]
  );

  return (
    <div className="App">
      <section className="section-center">
        <h4>Shoping lista</h4>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            className="input-item"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            ref={inputRef}
          />
          <button className="button-add">
            {editMode ? "Potvrdi" : "Dodaj"}
          </button>
        </form>
        <ItemList
          list={list}
          setList={setList}
          setEditId={setEditId}
          setEditMode={setEditMode}
          inputRef={inputRef}
        />
        {list.length > 1 && (
          <button className="button button-delete-all" onClick={clear}>
            Obriši sve
          </button>
        )}
      </section>
    </div>
  );
}

function ItemList({ list, setList, setEditId, setEditMode, inputRef }) {
  return (
    <div className="item-list">
      {list.map((item) => (
        <SingleItem
          key={item.id}
          id={item.id}
          setList={setList}
          list={list}
          setEditId={setEditId}
          setEditMode={setEditMode}
          inputRef={inputRef}
        >
          {item.name}
        </SingleItem>
      ))}
    </div>
  );
}

function SingleItem({
  children,
  id,
  setList,
  setEditId,
  setEditMode,
  inputRef,
}) {
  const [marked, setMarked] = useState(false);

  function handleDelete(e) {
    setList((list) => list.filter((item) => item.id !== e.target.id));
  }

  function handleEdit(e) {
    setEditId(e.target.id);
    setEditMode(true);
    inputRef.current.focus();
  }

  return (
    <article className="single-item" key={id}>
      <div className="checkbox-name">
        <input
          type="checkbox"
          className="input-checkbox"
          onChange={() => setMarked((marked) => !marked)}
        />
        <p className={`item-name ${marked && "item-name-marked"}`}>
          {children}
        </p>
      </div>
      <div className="buttons-div">
        <button className="button button-edit" onClick={handleEdit} id={id}>
          <EditIcon className="icon-edit" />
        </button>
        <button className="button button-delete" onClick={handleDelete} id={id}>
          <BinIcon className="icon-bin" />
        </button>
      </div>
    </article>
  );
}
