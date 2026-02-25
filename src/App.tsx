import { Routes, Route } from "react-router";
import Projects from "@/features/Projects.tsx";
import ProjectDetails from "@/features/ProjectDetails.tsx";

const App = () => {
    return (
        <div className="min-h-screen bg-background p-8">
            <Routes>
                <Route path="/" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
            </Routes>
        </div>
    );
};

export default App;
