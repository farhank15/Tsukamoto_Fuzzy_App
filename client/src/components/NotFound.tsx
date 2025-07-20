import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-ping"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* Glitchy 404 text */}
          <div className="relative mb-8">
            <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse select-none">
              404
            </h1>
            <div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-white/10 animate-ping select-none">
              404
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6 text-white">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Oops! Page Not Found
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
                The page you're looking for has vanished into the digital void.
                Let's get you back on track!
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                className="backdrop-blur-sm hover:text-slate-600 hover:bg-purple-200 hover:font-semibold transform hover:scale-105 transition-all duration-200 rounded-full py-1.5 px-3 border-slate-100 border"
                to="/"
              >
                Back To Home
              </Link>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="border-purple-400/30 cursor-pointer text-purple-500 hover:bg-purple-400/10 hover:text-purple-200 px-8 py-3 rounded-full backdrop-blur-sm transform hover:scale-105 transition-all duration-200"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
            </div>
          </div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)] opacity-50" />
      </div>
    </div>
  );
};

export default NotFound;
