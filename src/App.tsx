import { Routes, Route, Link } from "react-router";
import Projects from "@/features/projects/Projects.tsx";
import ProjectDetails from "@/features/project/ProjectDetails.tsx";
import CreateProject from "@/features/project/CreateProject.tsx";
import EditProject from "@/features/project/EditProject.tsx";
import CreateCustomer from "@/features/customer/CreateCustomer.tsx";
import CustomerDetails from "@/features/customer/CustomerDetails.tsx";
import EditCustomer from "@/features/customer/EditCustomer.tsx";

const App = () => {
    return (
        <div className="min-h-screen bg-background">
            <header className="bg-slate-800 text-white py-4 px-8">
                <Link to="/" className="text-xl font-bold hover:text-slate-200">
                    Kommune
                </Link>
            </header>
            <main className="max-w-7xl mx-auto p-8">
                <Routes>
                    <Route path="/" element={<Projects />} />
                    <Route path="/projects/new" element={<CreateProject />} />
                    <Route path="/customers/new" element={<CreateCustomer />} />
                    <Route path="/customers/:id" element={<CustomerDetails />} />
                    <Route path="/customers/:id/edit" element={<EditCustomer />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    <Route path="/projects/:id/edit" element={<EditProject />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
