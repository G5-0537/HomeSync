import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { HouseholdProvider } from './context/HouseholdContext';
import { ToastProvider } from './context/ToastContext';
import { DemoBanner } from './components/layout/DemoBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LandlordLayout } from './components/layout/LandlordLayout';
import { HomeSyncAIModal } from './components/ai/HomeSyncAIModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/marketplace/ExplorePage';
import { PropertyDetailPage } from './pages/marketplace/PropertyDetailPage';
import { ApplyPage } from './pages/marketplace/ApplyPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Tenant Dashboard Pages
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { ExpensesPage } from './pages/dashboard/ExpensesPage';
import { ChoresPage } from './pages/dashboard/ChoresPage';
import { InventoryPage } from './pages/dashboard/InventoryPage';
import { RentPage } from './pages/dashboard/RentPage';
import { AgreementPage } from './pages/dashboard/AgreementPage';
import { DepositPage } from './pages/dashboard/DepositPage';
import { InspectionPage } from './pages/dashboard/InspectionPage';
import { MaintenancePage } from './pages/dashboard/MaintenancePage';

// Landlord Pages
import { LandlordOverviewPage } from './pages/landlord/LandlordOverviewPage';
import { LandlordPropertiesPage } from './pages/landlord/LandlordPropertiesPage';
import { LandlordApplicationsPage } from './pages/landlord/LandlordApplicationsPage';
import { LandlordRentPage } from './pages/landlord/LandlordRentPage';
import { LandlordMaintenancePage } from './pages/landlord/LandlordMaintenancePage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <HouseholdProvider>
              <div className="min-h-screen flex flex-col bg-ivory dark:bg-charcoal-900 text-charcoal dark:text-ivory-100 font-sans selection:bg-sage-200 selection:text-sage-900 transition-colors duration-200">
                {/* Interactive Demo Mode Persona Switcher */}
                <DemoBanner />

                {/* Main Navigation with Theme Toggle */}
                <Navbar />

                {/* Routing Content */}
                <div className="flex-1">
                  <Routes>
                    {/* Public Marketplace & Landing */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/properties" element={<Navigate to="/explore" replace />} />
                    <Route path="/properties/:id" element={<PropertyDetailPage />} />
                    <Route path="/apply/:id" element={<ApplyPage />} />

                    {/* Auth */}
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Tenant Household Dashboard */}
                    <Route path="/dashboard" element={<DashboardLayout />}>
                      <Route index element={<DashboardOverviewPage />} />
                      <Route path="expenses" element={<ExpensesPage />} />
                      <Route path="chores" element={<ChoresPage />} />
                      <Route path="inventory" element={<InventoryPage />} />
                      <Route path="rent" element={<RentPage />} />
                      <Route path="agreement" element={<AgreementPage />} />
                      <Route path="deposit" element={<DepositPage />} />
                      <Route path="inspection" element={<InspectionPage />} />
                      <Route path="maintenance" element={<MaintenancePage />} />
                    </Route>

                    {/* Landlord Management Hub */}
                    <Route path="/landlord" element={<LandlordLayout />}>
                      <Route index element={<LandlordOverviewPage />} />
                      <Route path="properties" element={<LandlordPropertiesPage />} />
                      <Route path="applications" element={<LandlordApplicationsPage />} />
                      <Route path="rent" element={<LandlordRentPage />} />
                      <Route path="maintenance" element={<LandlordMaintenancePage />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>

                {/* Footer */}
                <Footer />

                {/* Global Floating AI Personal Consultant */}
                <HomeSyncAIModal />
              </div>
            </HouseholdProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
