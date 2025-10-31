import { Outlet } from "react-router-dom";


export default function Dashboard() {
  return (
    <div>
  
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}