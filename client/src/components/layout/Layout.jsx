import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

const Layout = () => {
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <aside className="hidden md:flex md:flex-shrink-0">
                <Sidebar />
            </aside>

            <div className="flex flex-col flex-1 w-full overflow-y-auto">
                <Topbar />

                <main className="flex-1 pb-20 md:pb-0">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>

                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-glass">
                    <BottomNav />
                </nav>
            </div>
        </div>
    );
};

export default Layout;
