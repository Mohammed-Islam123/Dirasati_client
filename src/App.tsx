import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import Dashboard from "./pages/dashboard/Dashboard";
import Enseignants from "./pages/dashboard/Enseignants";
import AddTeacher from "./pages/dashboard/AddTeacher";
import TeacherProfil from "./pages/dashboard/TeacherProfil";
import Eleve from "./pages/dashboard/Eleve";
import AddEmployee from "./pages/dashboard/AddEmployee";
import Employees from "./pages/dashboard/Employees";
import TeacherDashboard from "./pages/TeacherDashboard/TeacherDashboard";
import Absence from "./pages/TeacherDashboard/Absence";
import Etablisment from "./pages/dashboard/Etablisment";
import Home from "./pages/home/Home";
import GestionClass from "./pages/dashboard/GestionClass";
import { Toaster } from "react-hot-toast";
import Convocation from "./pages/TeacherDashboard/Convocation";
import ResetTeacherPassword from "./pages/TeacherDashboard/ResetTeacherPassword";
import Calender from "./components/_planification/Calender";
import ConvocationSuccess from "./pages/SuccessPages/ConvocationSuccess";
// import NotesManagementPage from "./pages/TeacherDashboard/NotesManagementPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/register"
          element={
            <UnProtectedRoute>
              <Registration />
            </UnProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <UnProtectedRoute>
              <Login />
            </UnProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <UnProtectedRoute>
              <Home />
            </UnProtectedRoute>
          }
        />
        <Route path="/calender" element={<Calender />} />
        {/* Dashboard with subroutes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Etablisment />} /> {/* Default route */}
          <Route path="enseignants" element={<Enseignants />} />
          <Route path="addTeacher" element={<AddTeacher />} />
          <Route path="teachers/:id" element={<TeacherProfil />} />
          <Route path="Eleves" element={<Eleve />} />
          <Route path="*" element={<div>Page Not Found</div>} />
          <Route path="employees" element={<Employees />} />
          <Route path="addEmployee" element={<AddEmployee />} />
          <Route path="gestion" element={<GestionClass />} />
          <Route path="students/:id/convocation" element={<Convocation />} />
          <Route path="établisment" element={<Etablisment />} />
        </Route>

        <Route path="/Teacherdashboard" element={<TeacherDashboard />}>
          <Route index element={<Etablisment />} /> {/* Default route */}
          <Route path="enseignants" element={<Enseignants />} />
          <Route path="teachers/:id" element={<TeacherProfil />} />
          <Route path="eleves" element={<Absence />} />
          <Route path="établisment" element={<Etablisment />} />
          <Route path="profile" element={<ResetTeacherPassword />} />
          <Route path="notes" element={<></>} />
          <Route path="groups/:groupId/notes" element={<></>} />
          <Route path="groups/:groupId/eleves" element={<></>} />
          <Route path="planification" element={<></>} />
          <Route path="paiments" element={<></>} />
          <Route path="convocation-success" element={<ConvocationSuccess />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
};

export default App;

const ProtectedRoute: React.FC<React.PropsWithChildren<object>> = ({
  children,
}) => {
  const token = localStorage.getItem("dirasati_token");
  if (token) return children;
  else return <Navigate to="/login" replace />;
};

const UnProtectedRoute: React.FC<React.PropsWithChildren<object>> = ({
  children,
}) => {
  const token = localStorage.getItem("dirasati_token");
  if (!token) return children;
  else return <Navigate to="/dashboard" replace />;
};
