import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchFormFields, deleteFormField } from '../../features/formFields/formFieldsSlice';
import CreateFormField from './CreateFormField';

const FormFieldsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { fields, loading, error } = useSelector((state: RootState) => state.formFields);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchFormFields(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleDelete = async (fieldId: number) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      await dispatch(deleteFormField(fieldId));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Form Fields</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Add Field'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
          <CreateFormField formId={parseInt(id!)} onSuccess={() => setShowCreateForm(false)} />
        </div>
      )}

      {fields.length === 0 ? (
        <p>No fields found. Add your first field!</p>
      ) : (
        <div>
          {[...fields]
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <div key={field.id} style={{ padding: '15px', border: '1px solid #eee', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3>{field.label}</h3>
                    <p>Type: {field.fieldType}</p>
                    {field.placeholder && <p>Placeholder: {field.placeholder}</p>}
                    <p>Required: {field.required ? 'Yes' : 'No'}</p>
                    <p>Order: {field.order}</p>
                    {field.options && field.options.length > 0 && (
                      <p>Options: {field.options.join(', ')}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(field.id)}
                    style={{ color: 'red', background: 'none', border: 'none' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FormFieldsList;