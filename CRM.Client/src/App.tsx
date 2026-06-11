import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/routes/ProtectedRoute";
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import PublicLayout from "./layouts/PublicLayout";
import ServicesPage from "./pages/public/ServicePage";
import AboutPage from "./pages/public/AboutPage";
import PublicInquiryPage from "./pages/public/InquirePage";
import AuthLayout from "./layouts/AuthLayout";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/DashboardPage";
import AdminInquiriesPage from "./pages/admin/inquiries/InquiriesPage";
import AdminInquiryDetailPage from "./pages/admin/inquiries/InquriesDetailPage";
import AdminNewInquiryPage from "./pages/admin/inquiries/NewInquiriesPage";
import AdminDiagnosisPage from "./pages/admin/diagnoses/DiagnosisPage";
import AdminDiagnosisDetailPage from "./pages/admin/diagnoses/DiagnosisDetailPage";

import AdminQuotationPage from "./pages/admin/quotations/QuotationPage";
import AdminQuotationDetailPage from "./pages/admin/quotations/QuotationDetailPage";
import AdminQuotationFormPage from "./pages/admin/quotations/QuotationFormPage";

import AdminJobOrderPage from "./pages/admin/joborders/JobOrderPage";
import AdminJobOrderDetailPage from "./pages/admin/joborders/JobOrderDetailPage";

import AdminServiceAgreementPage from "./pages/admin/serviceagreeements/ServiceAgreementPage";
import AdminServiceAgreementDetailPage from "./pages/admin/serviceagreeements/ServiceAgreementDetailPage";

import AdminTicketPage from "./pages/admin/tickets/TicketPage";
import AdminTicketDetailPage from "./pages/admin/tickets/TicketsDetailPage";

import AdminServiceCatalogPage from "./pages/admin/services/ServicePage";

import AdminDevicesPage from "./pages/admin/devices/DevicePage";

import AdminCampaignPage from "./pages/admin/campaign/CampaignPage";
import AdminCampaignDetailPage from "./pages/admin/campaign/CampaignDetailPage";

import AdminTechnicianPage from "./pages/admin/users/UserPage";

import AdminCustomerPage from "./pages/admin/customers/CustomerPage";
import AdminCustomerDetailPage from "./pages/admin/customers/CustomerDetailPage";

import AdminBillingDashboard from "./pages/admin/reports/ReportsPage";
import AdminInvoicesPage from "./pages/admin/invoices/InvoicePage";

import TechnicianLayout from "./layouts/TechnicianLayout";

import TechnicianDashboard from "./pages/technician/DashboardPage";

import TechnicianInquiriesPage from "./pages/technician/inquiries/InquiriesPage";
import TechnicianInquiryDetailPage from "./pages/technician/inquiries/InquiriesDetailPage";

import TechnicianDiagnosisPage from "./pages/technician/diagnosis/DiagnosisPage";

import TechnicianJobsPage from "./pages/technician/joborders/JobOrderPage";
import TechnicianJobDetailPage from "./pages/technician/joborders/JobOrderDetail";

import CreateInquiryPage from "./pages/customer/inquiries/NewInquiriesPage";


import CustomerLayout from "./layouts/CustomerLayout";
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerMyJobsPage from "./pages/customer/jobs/JobOrderPage";

import CustomerInquiriesPage from "./pages/customer/inquiries/InquiriesPage";
import CustomerInquiryDetailPage from "./pages/customer/inquiries/InquiriesDetailPage";

import CustomerQuotationDetailPage from "./pages/customer/quotations/QuotationPage";

import CustomerInvoicePage from "./pages/customer/invoices/InvoicePage";

import CustomerTicketDetailPage from "./pages/customer/tickets/TicketsPage";
import CreateTicketPage from "./pages/customer/tickets/NewTicketsPage";
import CustomerTicketListPage from "./pages/customer/tickets/TicketsPage";

import CustomerServiceCatalogPage from "./pages/customer/services/ServicePage";

import CustomerReviewsPage from "./pages/customer/feedback/FeedbackPage";

import CustomerSettingsPage from "./pages/customer/profile/ProfilePage";
export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/*Public*/}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/about-us" element={<AboutPage />} />
                        <Route path="/inquire" element={<PublicInquiryPage />} />
                    </Route>

                    {/*Auth*/}
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />   
                    </Route>

                    {/*Admin */}
                    <Route element={<ProtectedRoute allowedRoles={["Admin","SuperAdmin"]}/>}>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin/dashboard" element={<AdminDashboardPage />}/>

                            <Route path="/admin/inquiries" element={<AdminInquiriesPage />}/>
                            <Route path="/admin/inquiries/:id" element={<AdminInquiryDetailPage />}/>
                            <Route path="/admin/inquiries/new" element={<AdminNewInquiryPage />} />

                            <Route path="/admin/diagnosis" element={<AdminDiagnosisPage />}/>
                            <Route path="/admin/diagnosis/:id" element={<AdminDiagnosisDetailPage />}/>

                            <Route path="/admin/quotations" element={<AdminQuotationPage />}/>
                            <Route path="/admin/quotations/:id" element={<AdminQuotationDetailPage />}/>
                            <Route path="/admin/quotations/create" element={<AdminQuotationFormPage />}/>

                            <Route path="/admin/job-orders" element={<AdminJobOrderPage />}/>
                            <Route path="/admin/job-orders-detail" element={<AdminJobOrderDetailPage />}/>

                            <Route path="/admin/service-agreements" element={<AdminServiceAgreementPage />}/>
                            <Route path="/admin/service-agreements/:id" element={<AdminServiceAgreementDetailPage />}/>


                            <Route path="/admin/invoices" element={<AdminInvoicesPage />}/>

                            <Route path="/admin/tickets" element={<AdminTicketPage />}/>
                            <Route path="/admin/tickets/:id" element={<AdminTicketDetailPage />}/>

                            <Route path="/admin/services" element={<AdminServiceCatalogPage />}/>

                            <Route path="/admin/devices" element={<AdminDevicesPage />}/>
                            
                            <Route path="/admin/campaigns" element={<AdminCampaignPage />}/>
                            <Route path="/admin/campaigns/:id" element={<AdminCampaignDetailPage />}/>
                            
                            <Route path="/admin/technicians" element={<AdminTechnicianPage />}/>

                            <Route path="/admin/customers" element={<AdminCustomerPage />}/>
                            <Route path="/admin/customers/:id" element={<AdminCustomerDetailPage />}/>

                            <Route path="/admin/reports" element={<AdminBillingDashboard />}/>
                        </Route>
                    </Route>
                    
                    {/*Technician */}
                    <Route element={<ProtectedRoute allowedRoles={["Technician","SuperAdmin"]}/>}>
                        <Route element={<TechnicianLayout />}>
                            <Route path="/technician/dashboard" element={<TechnicianDashboard />}/>

                            <Route path="/technician/inquiries" element={<TechnicianInquiriesPage/>}/>
                            <Route path="/technician/inquiries/:id" element={<TechnicianInquiryDetailPage/>}/>

                            <Route path="/technician/diagnosis/:id" element={<TechnicianDiagnosisPage />}/>

                            <Route path="/technician/job-orders" element={<TechnicianJobsPage />}/>
                            <Route path="/technician/job-orders-detail" element={<TechnicianJobDetailPage />}/>
                        </Route>
                    </Route>
                    {/*Customer */}
                    <Route element={<ProtectedRoute allowedRoles={["Customer","SuperAdmin"]}/>}>
                        <Route element={<CustomerLayout />}>
                            <Route path="/customer/dashboard/" element={<CustomerDashboard/>}/>

                            <Route path="/customer/jobs/" element={<CustomerMyJobsPage/>}/>

                            <Route path="/customer/inquiries/new" element={<CreateInquiryPage/>}/>
                            <Route path="/customer/inquiries/" element={<CustomerInquiriesPage/>}/>
                            <Route path="/customer/inquiries/:id" element={<CustomerInquiryDetailPage/>}/>

                            <Route path="/customer/quotations/" element={<CustomerQuotationDetailPage/>}/>

                            <Route path="/customer/invoices/" element={<CustomerInvoicePage/>}/>

                            <Route path="/customer/tickets/" element={<CustomerTicketListPage/>}/>
                            <Route path="/customer/tickets/new" element={<CreateTicketPage/>}/>
                            <Route path="/customer/tickets/:id" element={<CustomerTicketDetailPage/>}/>

                            <Route path="/customer/services/" element={<CustomerServiceCatalogPage/>}/>
                            <Route path="/customer/reviews/" element={<CustomerReviewsPage/>}/>

                            <Route path="/customer/settings/" element={<CustomerSettingsPage/>}/>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}