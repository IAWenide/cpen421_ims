import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inventoryAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import './ItemForm.css';

const EditItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const item = await inventoryAPI.getItemById(id);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        quantity: item.quantity || '',
        price: item.price || '',
        category: item.category || '',
      });
    } catch (err) {
      setSubmitError('Failed to load item');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      await inventoryAPI.updateItem(id, {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      });
      navigate('/dashboard');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (fetchLoading) {
    return (
      <div className="dashboard-layout">
        <Sidebar user={user} />
        <div className="dashboard-content">
          <div className="item-form-container">
            <div className="loading">Loading item...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} />

      <div className="dashboard-content">
        <div className="item-form-container">
          <div className="item-form-card">
            <h1>Edit Item</h1>

            {submitError && <div className="error-message">{submitError}</div>}

            <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Item Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              disabled={loading}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">
                Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                disabled={loading}
              />
              {errors.quantity && (
                <span className="field-error">{errors.quantity}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price">
                Price <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={loading}
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
