import { AuthImage3, IshakLogo } from "../../assets";
import { Link } from "react-router-dom";
import { LoginForm } from "../../components/auth/LoginForm";
import RoleSwitcher from "../../components/auth/RoleSwitcher";
import { useRoleStore } from "../../store/utls";

function Login() {
  const { role, setRole } = useRoleStore();
  const handleRoleChange = (newRole: "admin" | "teacher") => {
    setRole(newRole);
  };

  return (
    <div className="h-screen w-screen p-[50px] bg-[url('./assets/images/background.png')] bg-cover bg-center min-h-[850px]">
      <div className="container py-4 relative">
        <div className="absolute left-10 top-8">
          <img src={IshakLogo} alt="logo" width={250} />
        </div>
        <div className="custom-container flex flex-col lg:flex-row items-center gap-10">
          <div className="hidden lg:block lg:w-[50%]">
            <img src={AuthImage3} alt="Illustration" className="w-[600px]" />
          </div>
          <div className="lg:w-1/2 pl-10 h-[500px] flex flex-col gap-20 ">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
                Bienvenu dans Dirassati
              </h1>
              <p className="text-gray-600">connecter à votre compte</p>
              <div className="flex items-center justify-between w-[80%]">
                <span>login as</span>
                <RoleSwitcher
                  currentRole={role}
                  onRoleChange={handleRoleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 w-[80%] items-center">
              <div className="w-full flex flex-col gap-2">
                <LoginForm />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 inline mr-1">
                  Vous n'avez pas un compte?
                </p>
                <Link
                  to="/register"
                  className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors underline underline-offset-2 decoration-from-font"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
