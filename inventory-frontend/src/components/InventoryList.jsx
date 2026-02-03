import './InventoryList.css';

const InventoryList = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No inventory items found.</p>
        <p>Click "Add New Item" to get started.</p>
      </div>
    );
  }

  return (
    <div className="inventory-list">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.description || 'N/A'}</td>
              <td>
                <span className={`quantity ${item.quantity < 10 ? 'low-stock' : ''}`}>
                  {item.quantity}
                </span>
              </td>
              <td>${item.price?.toFixed(2) || '0.00'}</td>
              <td>{item.category || 'Uncategorized'}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => onEdit(item._id)}
                    className="btn-action btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="btn-action btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
