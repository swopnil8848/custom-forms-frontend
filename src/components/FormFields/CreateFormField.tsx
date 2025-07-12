import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { createFormField, fetchFormFields } from '../../features/formFields/formFieldsSlice';

interface CreateFormFieldProps {
  formId: number;
  onSuccess?: () => void;
}

const CreateFormField: React.FC<CreateFormFieldProps> = ({ formId, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [fieldData, setFieldData] = useState({
    fieldName: '',
    fieldType: 'text',
    label: '',
    placeholder: '',
    required: false,
    orderNumber: 1,
    options: '',
  });

  const fieldTypes = [
    'text', 'email', 'number', 'tel', 'url', 'password',
    'textarea', 'select', 'radio', 'checkbox', 'file'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const options = fieldData.options 
        ? fieldData.options.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0)
        : undefined;

      await dispatch(createFormField({
        formId,
        fieldData: {
          fieldName: fieldData.fieldName,
          fieldType: fieldData.fieldType,
          label: fieldData.label,
          placeholder: fieldData.placeholder || undefined,
          isRequired: fieldData.required,
          orderNumber: fieldData.orderNumber,
          options,
        },
      })).unwrap();

      dispatch(fetchFormFields(formId));

      setFieldData({
        fieldName: '',
        fieldType: 'text',
        label: '',
        placeholder: '',
        required: false,
        orderNumber: 1,
        options: '',
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to create field:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFieldData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked
              : name === 'orderNumber' ? parseInt(value) || 1
              : value,
    }));
  };

  const needsOptions = ['select', 'radio', 'checkbox'].includes(fieldData.fieldType);

  return (
    <div>
      <h3>Add New Field</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Field Name:
            <input
              type="text"
              name="fieldName"
              value={fieldData.fieldName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Field Type:
            <select
              name="fieldType"
              value={fieldData.fieldType}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              {fieldTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Label:
            <input
              type="text"
              name="label"
              value={fieldData.label}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Placeholder:
            <input
              type="text"
              name="placeholder"
              value={fieldData.placeholder}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Order Number:
            <input
              type="number"
              name="orderNumber"
              value={fieldData.orderNumber}
              onChange={handleChange}
              min={1}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              name="required"
              checked={fieldData.required}
              onChange={handleChange}
              style={{ marginRight: '5px' }}
            />
            Required
          </label>
        </div>

        {needsOptions && (
          <div style={{ marginBottom: '15px' }}>
            <label>
              Options (comma-separated):
              <textarea
                name="options"
                value={fieldData.options}
                onChange={handleChange}
                placeholder="Option 1, Option 2, Option 3"
                style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '60px' }}
              />
            </label>
          </div>
        )}

        <div>
          <button type="submit" style={{ marginRight: '10px' }}>
            Add Field
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFormField;
