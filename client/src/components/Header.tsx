import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Car, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth2";

const Header = () => {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const routes = [
    { path: "/", label: "Welcome" },
    { path: "/home", label: "Home" },
    { path: "/visualizations", label: "Visualizations" },
    { path: "/about", label: "About" }
  ];
  
  // Additional routes for authenticated users
  const authRoutes = [
    { path: "/reservations", label: "My Reservations" },
    { path: "/payment-history", label: "Payment History" }
  ];
  
  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const isCurrentPath = (path: string) => location === path;
  
  return (
    <header className="bg-[#006747] text-white shadow-md">
      <div className="bg-[#D9F2EA] py-1">
        <div className="container mx-auto px-4 flex justify-end">
          <span className="text-xs font-medium text-[#006747]">USFParkingApp</span>
        </div>
      </div>
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Car className="h-6 w-6 text-white" />
          <Link href="/" className="text-xl font-medium">
            USFParkingApp
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-8">
          {routes.map((route) => (
            <Link 
              key={route.path} 
              href={route.path}
              className={`py-2 border-b-2 ${
                isCurrentPath(route.path) 
                  ? "border-white" 
                  : "border-transparent hover:border-white transition-colors duration-200"
              }`}
            >
              {route.label}
            </Link>
          ))}
          
          {user && authRoutes.map((route) => (
            <Link 
              key={route.path} 
              href={route.path}
              className={`py-2 border-b-2 ${
                isCurrentPath(route.path) 
                  ? "border-white" 
                  : "border-transparent hover:border-white transition-colors duration-200"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                className="hidden md:flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white rounded-full"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">{user?.name || 'User'}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden md:flex bg-white/10 hover:bg-white/20 text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="text-sm">Logout</span>
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              className="hidden md:flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setLocation('/login')}
            >
              <LogIn className="h-4 w-4 mr-1" />
              <span className="text-sm">Login</span>
            </Button>
          )}
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Car className="h-5 w-5 text-[#006747]" />
                  <span className="text-lg font-medium text-[#006747]">USFParkingApp</span>
                </div>
                
                {routes.map((route) => (
                  <Link 
                    key={route.path} 
                    href={route.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`py-2 text-lg ${
                      isCurrentPath(route.path) 
                        ? "text-[#006747] font-medium" 
                        : "text-gray-600 hover:text-[#006747]"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
                
                {user && (
                  <>
                    <hr className="my-4" />
                    {authRoutes.map((route) => (
                      <Link 
                        key={route.path} 
                        href={route.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`py-2 text-lg ${
                          isCurrentPath(route.path) 
                            ? "text-[#006747] font-medium" 
                            : "text-gray-600 hover:text-[#006747]"
                        }`}
                      >
                        {route.label}
                      </Link>
                    ))}
                  </>
                )}
                
                <hr className="my-4" />
                {user ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-[#006747]" />
                      <div className="font-medium">{user?.name || 'User'}</div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-2 text-[#006747] border-[#006747] hover:bg-[#006747] hover:text-white"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 text-[#006747] border-[#006747] hover:bg-[#006747] hover:text-white"
                    onClick={() => {
                      setLocation('/login');
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;