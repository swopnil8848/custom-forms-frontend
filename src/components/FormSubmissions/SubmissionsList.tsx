import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { FormSubmission, PaginatedResponse, ApiResponse } from '../../types/form.types';
import { FormSubmissionsAPI } from '../../api/formSubmissions.api';

const SubmissionsList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submissions, setSubmissions] = useState<PaginatedResponse<FormSubmission> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<PaginatedResponse<FormSubmission>> = await FormSubmissionsAPI.getFormSubmissions(parseInt(id), 1, 10);
        setSubmissions(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || 'Failed to load submissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  if (loading) return <div>Loading submissions...</div>;
  if (error) return <div>Error: {error}</div>;

  const hasSubmissions = submissions?.data?.length ?? 0;

  return (
    <div>
      <h1>Form Submissions</h1>

      {hasSubmissions === 0 ? (
        <p>No submissions found for this form.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {submissions!.data.map((submission) => (
            <li
              key={submission.id}
              style={{
                border: '1px solid #eee',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '4px'
              }}
            >
              <p><strong>Submission ID:</strong> {submission.id}</p>
              <p><strong>Submitted At:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
              {/* Render submission fields cleanly */}
              {submission.data && submission.data.length > 0 && (
                <div>
                  <strong>Fields:</strong>
                  <ul style={{ marginLeft: '20px' }}>
                    {submission.data.map((field, index) => (
                      <li key={index}>
                        {field.label}: {field.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubmissionsList;
