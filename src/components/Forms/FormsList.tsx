import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchForms, deleteForm } from '../../features/forms/formsSlice';

const FormsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forms, loading, error, pagination } = useSelector((state: RootState) => state.forms);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchForms({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      await dispatch(deleteForm(id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Forms</h1>
        <Link to="/forms/create">
          <button>Create New Form</button>
        </Link>
      </div>

      {forms.length === 0 ? (
        <p>No forms found. Create your first form!</p>
      ) : (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Created</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr key={form.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{form.title}</td>
                  <td style={{ padding: '10px' }}>
                    {form.isPublished ? 'Published' : 'Draft'}
                  </td>
                  <td style={{ padding: '10px' }}>
                    {new Date(form.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <Link to={`/forms/${form.id}`} style={{ marginRight: '10px' }}>
                      View
                    </Link>
                    <Link to={`/forms/${form.id}/edit`} style={{ marginRight: '10px' }}>
                      Edit
                    </Link>
                    <Link to={`/forms/${form.id}/fields`} style={{ marginRight: '10px' }}>
                      Fields
                    </Link>
                    <Link to={`/forms/${form.id}/submissions`} style={{ marginRight: '10px' }}>
                      Submissions
                    </Link>
                    <button 
                      onClick={() => handleDelete(form.id)}
                      style={{ color: 'red', background: 'none', border: 'none' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    margin: '0 5px',
                    padding: '5px 10px',
                    backgroundColor: page === currentPage ? '#007bff' : '#fff',
                    color: page === currentPage ? '#fff' : '#007bff',
                    border: '1px solid #007bff',
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormsList;