import { useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc, orderBy } from "firebase/firestore";
import "../css/ShoppingList.css";

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const listRef = collection(db, "users", user.uid, "shoppingList");
        const q = query(listRef, orderBy("addedAt", "desc"));

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const listData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setItems(listData);
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Function to check/uncheck items
  const toggleComplete = async (id, currentStatus) => {
    const itemRef = doc(db, "users", auth.currentUser.uid, "shoppingList", id);
    await updateDoc(itemRef, { completed: !currentStatus });
  };

  // Function to remove items
  const removeItem = async (id) => {
    const itemRef = doc(db, "users", auth.currentUser.uid, "shoppingList", id);
    await deleteDoc(itemRef);
  };

  if (!auth.currentUser) return <p className="list-msg">Please log in to see your list.</p>;
  if (loading) return <p className="list-msg">Loading your groceries...</p>;

  return (
    <div className="shopping-list-container">
      <h2 className="page-header">My Shopping List</h2>

      {items.length === 0 ? (
        <p className="empty-msg">Your list is empty. Start adding ingredients!</p>
      ) : (
        <div className="list-grid">
          {items.map((item) => (
            <div key={item.id} className={`list-item ${item.completed ? "checked" : ""}`}>
              <div className="item-info">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleComplete(item.id, item.completed)}
                />
                <div>
                  <p className="item-name">{item.amount} {item.unit} {item.name}</p>
                  <small className="recipe-tag">For: {item.recipeTitle}</small>
                </div>
              </div>
              <button className="delete-btn" onClick={() => removeItem(item.id)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShoppingList;
