import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import FormsList from './components/Forms/FormsList';
import CreateForm from './components/Forms/CreateForm';
import EditForm from './components/Forms/EditForm';
import FormFieldsList from './components/FormFields/FormFieldsList';
import SubmissionsList from './components/FormSubmissions/SubmissionsList';
import FormSubmissionPage from './components/FormSubmissions/FormSubmissionPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Navbar />
          <main style={{ padding: '20px' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <FormsList />
                </ProtectedRoute>
              } />
              <Route path="/forms" element={
                <ProtectedRoute>
                  <FormsList />
                </ProtectedRoute>
              } />
              <Route path="/forms/create" element={
                <ProtectedRoute>
                  <CreateForm />
                </ProtectedRoute>
              } />
              <Route path="/forms/:id/edit" element={
                <ProtectedRoute>
                  <EditForm />
                </ProtectedRoute>
              } />
              <Route path="/forms/:id/fields" element={
                <ProtectedRoute>
                  <FormFieldsList />
                </ProtectedRoute>
              } />
              <Route path="/forms/:id/submissions" element={
                <ProtectedRoute>
                  <SubmissionsList />
                </ProtectedRoute>
              } />
              <Route path="/forms/:formId/submit" element={<FormSubmissionPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;