
import React, { createContext, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronFirst, ChevronLast } from 'lucide-react';

interface SidebarContextType {
    expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ expanded: true });

interface SidebarProps {
    children: React.ReactNode;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, isSidebarOpen, setIsSidebarOpen }) => {
    const [expanded, setExpanded] = React.useState(true);

    const toggleExpanded = () => setExpanded(curr => !curr);

    return (
        <>
            {/* Mobile overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 z-30 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            <aside className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <nav className="h-full flex flex-col bg-brand-secondary border-r border-gray-700 shadow-sm">
                    <div className={`p-4 pb-2 flex ${expanded ? 'justify-between' : 'justify-center'} items-center`}>
                        <h1 className={`overflow-hidden transition-all text-xl font-bold ${expanded ? "w-40" : "w-0"}`}>Edgtec</h1>
                        <button onClick={toggleExpanded} className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 hidden md:block">
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-3">{children}</ul>
                    </SidebarContext.Provider>

                    <div className="border-t border-gray-700 flex p-3">
                        <img src="https://picsum.photos/seed/edgtec/40" alt="" className="w-10 h-10 rounded-md" />
                        <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                            <div className="leading-4">
                                <h4 className="font-semibold">Edgtec Pty Ltd</h4>
                                <span className="text-xs text-gray-400">info@edgtec.co.za</span>
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
};


interface SidebarItemProps {
    icon: React.ReactNode;
    text: string;
    to: string;
    alert?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, to, alert }) => {
    const { expanded } = useContext(SidebarContext);
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <li
            className={`
                relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer
                transition-colors group
                ${isActive
                    ? "bg-gradient-to-tr from-brand-primary to-blue-400 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }
            `}
        >
            <Link to={to} className="flex items-center w-full">
                {icon}
                <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            </Link>
            {alert && (
                <div className={`absolute right-2 w-2 h-2 rounded bg-brand-primary ${expanded ? "" : "top-2"}`} />
            )}
            
            {!expanded && (
                <div className={`
                  absolute left-full rounded-md px-2 py-1 ml-6
                  bg-brand-secondary text-brand-light text-sm
                  invisible opacity-20 -translate-x-3 transition-all
                  group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                `}>
                    {text}
                </div>
            )}
        </li>
    );
};
