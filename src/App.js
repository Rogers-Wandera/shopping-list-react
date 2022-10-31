import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorageItems = () => {
  let list = localStorage.getItem("shoppingList");
  if(list) {
    return JSON.parse(localStorage.getItem("shoppingList"));
  } else {
    return []
  }
}

console.log(getLocalStorageItems())

function App() {
  const [name, setName] = useState("");
  const [alert, setAlert] = useState({show: false, type:"", msg:''});
  const [isEditing, setIsEditing] = useState(false);
  const [list, setList] = useState(getLocalStorageItems())
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name) {
      showAlert(true, "danger", "Please enter the name of the item");
    } else if(name && isEditing) {
      let itemList = list.map((item) => {
        if(item.id === editId) {
          return {...item, title: name}
        }
        return item;
      })
      setList(itemList);
      setEditId(null);
      setIsEditing(false);
      setName("")
      showAlert(true, "success", "item edited successFull")
    } else {
      showAlert(true, "success", "Item added to the list")
      let newList = {id: new Date().getTime().toString(), title: name};
      setList([...list, newList]);
      setName("")
    }
  }

  const showAlert = (show=false,type="",msg="") => {
    setAlert({show,type,msg})
  }

  const clearList = () => {
    setList([]);
    showAlert(true, "danger", "List is cleared");
  }

  const removeItem = (id) => {
    showAlert(true, "danger", "Item deleted");
    let newList = list.filter((item) => item.id !== id);
    setList(newList);
  }

  const editItem = (id) => {
    showAlert(true, "success", "Item edited successfully")
    let editItem = list.find((item) => item.id === id);
    setEditId(id);
    setIsEditing(true);
    setName(editItem.title)
  }

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(list))
  },[list])

  return(
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} hideAlert={showAlert} list={list}/>}
        <h3>Shopping list</h3>
        <div className='form-control'>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g eggs" />
          <button className='submit-btn' type='submit'>
            {isEditing ? "Edit" : "Submit"}
          </button>
        </div>
      </form>
      {
        list.length > 0 && 
        <div className='grocery-container'>
          <List items={list} removeItem={removeItem} editItem={editItem}/>
        <button className='clear-btn' onClick={clearList}>Clear list</button>
      </div>
      }
    </section>
  )
}

export default App
