import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Problems from './pages/Problems';
import ProblemDetails from './pages/ProblemDetails';
import MySubmissions from './pages/MySubmissions';
import SubmissionDetails from './pages/SubmissionDetails';
import ProfilePage from './pages/ProfilePage';
import GlobalLeaderboard from './pages/GlobalLeaderboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProblemsList from './pages/admin/ProblemsList';
import CreateProblem from './pages/admin/CreateProblem';
import EditProblem from './pages/admin/EditProblem';
import ManageTestCases from './pages/admin/ManageTestCases';
import ContestsList from './pages/contests/ContestsList';
import ContestDetails from './pages/contests/ContestDetails';
import CreateContest from './pages/contests/CreateContest';
import ManageContestProblems from './pages/contests/ManageContestProblems';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/problems/:id" element={<ProblemDetails />} />
              <Route path="/leaderboard" element={<GlobalLeaderboard />} />
              <Route path="/contests" element={<ContestsList />} />
              <Route path="/contests/:id" element={<ContestDetails />} />
              
              {/* Protected User Routes */}
              <Route 
                path="/profile/:id" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/submissions" 
                element={
                  <ProtectedRoute>
                    <MySubmissions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/submissions/:id" 
                element={
                  <ProtectedRoute>
                    <SubmissionDetails />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROBLEM_SETTER']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/problems" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROBLEM_SETTER']}>
                    <AdminProblemsList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/problems/new" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROBLEM_SETTER']}>
                    <CreateProblem />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/problems/:id/edit" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROBLEM_SETTER']}>
                    <EditProblem />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/problems/:id/testcases" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROBLEM_SETTER']}>
                    <ManageTestCases />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/contests/new" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROBLEM_SETTER']}>
                    <CreateContest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/contests/:id/manage" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PROBLEM_SETTER']}>
                    <ManageContestProblems />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;