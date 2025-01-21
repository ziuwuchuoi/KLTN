import { Link } from 'react-router-dom';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="mb-8">
        <Link to="/" className="text-2xl font-bold">
          Wanderlust
        </Link>
      </div>
      <div className="w-full max-w-[440px] px-4">
        {children}
      </div>
    </div>
  );