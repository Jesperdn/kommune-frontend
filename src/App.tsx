import { Routes, Route, Link } from "react-router";
import Projects from "@/features/Projects.tsx";
import ProjectDetails from "@/features/ProjectDetails.tsx";
import CreateProject from "@/features/CreateProject.tsx";
import CreateCustomer from "@/features/CreateCustomer.tsx";

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
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
