import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from './components/Layout';
import { HomePage } from './features/home/components/HomePage';
import { MembersListPage } from './features/dashboard/components/MembersListPage';
import { MembershipApplicationForm } from './features/membership/components/MembershipApplicationForm';
import { LoginPage } from './features/auth/components/LoginPage';
import { AdminDashboard } from './features/dashboard/components/AdminDashboard';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/adherer" element={<Layout><MembershipApplicationForm /></Layout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/members" element={<Layout><MembersListPage /></Layout>} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App
