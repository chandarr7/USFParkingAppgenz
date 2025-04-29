import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Phone } from "lucide-react";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Chandar Rathala",
      role: "Backend Architect",
      description: "Data Flow & System Design. Responsible for database architecture, API endpoints and backend implementation.",
      avatar: "CR"
    },
    {
      name: "Jennifer Negron",
      role: "Frontend Developer",
      description: "Home Page & CRUD Navigation. Created responsive user interfaces and implemented client-side functionality.",
      avatar: "JN"
    },
    {
      name: "Ronia Arabian",
      role: "Data Viz Specialist",
      description: "Visualizations & Styling. Developed interactive data visualizations and charts for the application.",
      avatar: "RA"
    },
    {
      name: "Subhan Faisal",
      role: "UI/UX Designer",
      description: "Responsive Layout & Styling. Created the design system and user experience flow for the application.",
      avatar: "SF"
    },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-medium">About Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>
              ParkEase is a comprehensive parking management solution designed to help users find, reserve, and manage parking spots easily.
              Our mission is to simplify the parking experience by providing real-time information about parking availability,
              allowing users to make reservations in advance, and offering valuable insights about parking trends.
            </p>
            <p>
              Developed as part of the Dynamic Web Application Development course, this project showcases our ability to build
              a functional web application with CRUD operations, API integration, and proper MVC architecture.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-medium">Our Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-[#006747] text-white text-xl">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">{member.name}</h3>
                <p className="text-sm text-[#006747] font-medium mb-2">{member.role}</p>
                <p className="text-sm text-neutral-600">{member.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-medium">Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 prose max-w-none">
            <div>
              <h3 className="text-lg font-medium mb-2">API Integration</h3>
              <p>
                We integrated with the Parking API available through RapidAPI to fetch parking data. The API provides information
                about parking spots, including location, price, and availability. We use this data to supplement our own database
                of parking spots, giving users a comprehensive view of available options.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Logical Data Model</h3>
              <p className="mb-4">
                How our entities relate behind the scenes:
              </p>
              <div className="overflow-x-auto">
                <p className="mb-2">
                  <span className="font-medium text-[#006747]">🔑 PK</span> - Primary Key &nbsp;&nbsp; 
                  <span className="font-medium text-[#006747]">🔗 FK</span> - Foreign Key &nbsp;&nbsp;
                  <span className="font-medium text-[#006747]">⚡ Computed Fields</span> &nbsp;&nbsp;
                  — One ParkingLot ↔ Many ParkingActivity ↔ One User
                </p>
                <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 overflow-auto flex justify-center">
                  <img 
                    src="/images/data-model.png"
                    alt="Logical Data Model" 
                    className="w-full max-w-3xl"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">CRUD Implementation</h3>
              <p className="mb-4">
                Our application implements full CRUD (Create, Read, Update, Delete) functionality for the following features:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Create:</strong> Users can add new parking reservations and save favorites</li>
                <li><strong>Read:</strong> Users can view parking spots, their reservations, and favorites</li>
                <li><strong>Update:</strong> Users can modify existing reservations (date, time, duration, etc.)</li>
                <li><strong>Delete:</strong> Users can cancel reservations and remove spots from favorites</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Technical Stack</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Frontend:</strong> React, TypeScript, Tailwind CSS, Shadcn UI</li>
                <li><strong>Backend:</strong> ASP.NET Core (C#)</li>
                <li><strong>Data Storage:</strong> Entity Framework Core with SQL Server</li>
                <li><strong>Architecture:</strong> MVC Pattern with Repository Design Pattern</li>
                <li><strong>Deployment:</strong> Azure Web App Service</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">GitHub Repository</h3>
              <div className="flex items-center space-x-2">
                <Github className="h-5 w-5" />
                <a href="https://github.com/yourusername/parkease" className="text-primary hover:underline">
                  https://github.com/yourusername/parkease
                </a>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Contact Information</h3>
              <p className="mb-4">
                For inquiries, support, or more information about this project, please contact:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <Mail className="h-5 w-5 mt-0.5 text-[#006747]" />
                  <span>
                    <a href="mailto:chandarrathala@usf.edu" className="text-primary hover:underline">chandarrathala@usf.edu</a>
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Phone className="h-5 w-5 mt-0.5 text-[#006747]" />
                  <span>
                    <a href="tel:+18134189804" className="text-primary hover:underline">+1 (813) 418-9804</a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUs;
