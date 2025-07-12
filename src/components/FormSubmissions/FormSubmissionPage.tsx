import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormSubmissionsAPI } from '../../api/formSubmissions.api';
import axiosInstance from '../../services/axiosInstance';

interface FormField {
  id: number;
  label: string;
  fieldName: string;
  fieldType: string;
  isRequired: boolean;
}

const FormSubmissionPage: React.FC = () => {
  const { formId } = useParams();
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formValues, setFormValues] = useState<Record<number, string>>({});
  const [fileInputs, setFileInputs] = useState<Record<number, File>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        const res = await axiosInstance.get(`/api/form/${formId}/fields`);
        setFormFields(res.data.data); // Adjust this path if needed
      } catch (err) {
        console.error('Failed to load form fields', err);
      }
    };
    fetchFormFields();
  }, [formId]);

  const handleChange = (fieldId: number, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleFileChange = (fieldId: number, file: File) => {
    setFileInputs((prev) => ({ ...prev, [fieldId]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const submissionData = formFields.map((field) => ({
        fieldId: field.id,
        value: formValues[field.id] || '',
      }));

      const formData = new FormData();
      formData.append('submissionData', JSON.stringify(submissionData));

      Object.entries(fileInputs).forEach(([fieldId, file]) => {
        formData.append(`field_${fieldId}`, file); // Correct way to name files for backend
      });

      // Use the API function to send submission
      const res = await FormSubmissionsAPI.submitForm(Number(formId), submissionData, Object.values(fileInputs));

      setMessage(`✅ Form submitted successfully! Submission ID: ${res.data.submissionId}`);

      // Reset form
      setFormValues({});
      setFileInputs({});
    } catch (err) {
      console.error(err);
      setMessage('❌ Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h2>Submit Form</h2>
      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.id} style={{ marginBottom: 20 }}>
            <label>
              <strong>{field.label}</strong> {field.isRequired && '*'}
              <br />
              {field.fieldType === 'file' ? (
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(field.id, file);
                  }}
                  required={field.isRequired}
                  style={{ marginTop: '5px' }}
                />
              ) : (
                <input
                  type={field.fieldType}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.isRequired}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              )}
            </label>
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Form'}
        </button>

        {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
      </form>
    </div>
  );
};

export default FormSubmissionPage;
