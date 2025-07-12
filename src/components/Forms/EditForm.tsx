import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchFormById, updateForm } from '../../features/forms/formsSlice';

const EditForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentForm, loading } = useSelector((state: RootState) => state.forms);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublished: false,
    expiresAt: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchFormById(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentForm) {
      setFormData({
        title: currentForm.title,
        description: currentForm.description || '',
        isPublished: currentForm.isPublished,
        expiresAt: currentForm.expiresAt ? new Date(currentForm.expiresAt).toISOString().slice(0, 16) : '',
      });
    }
  }, [currentForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await dispatch(updateForm({
        id: parseInt(id),
        formData: {
          title: formData.title,
          description: formData.description || undefined,
          isPublished: formData.isPublished,
          expiresAt: formData.expiresAt || undefined,
        },
      })).unwrap();
      
      navigate('/forms');
    } catch (error) {
      console.error('Failed to update form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (!currentForm) return <div>Form not found</div>;

  return (
    <div>
      <h1>Edit Form</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '80px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              style={{ marginRight: '5px' }}
            />
            Published
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Expires At:
            <input
              type="datetime-local"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div>
          <button type="submit" style={{ marginRight: '10px' }}>
            Update Form
          </button>
          <button type="button" onClick={() => navigate('/forms')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;