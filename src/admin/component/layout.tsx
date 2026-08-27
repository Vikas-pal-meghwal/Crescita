import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from "../../assets/admin-crescita-logo.png"
import Clogo from "../../assets/icon.png"

import {
    X,
    LayoutTemplate,
    Home,
    LogOut,
    Menu,
    ChevronsLeft,
    BarChart2,
    BookOpen,
    Tag,
} from 'lucide-react'

const navItems = [
    { label: 'Analytics', to: '/admin/analytics', icon: BarChart2 },
    { label: 'Dashboard', to: '/admin/dashboard', icon: Home },
    { label: 'Products', to: '/admin/products', icon: LayoutTemplate },
    { label: 'Blogs', to: '/admin/blogs', icon: BookOpen },
    { label: 'Sale', to: '/admin/sale', icon: Tag, highlight: true },
]


const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    const handleLogoClick = () => {
        if (window.innerWidth >= 768) {
            setCollapsed(!collapsed)
        } else {
            setSidebarOpen(!sidebarOpen)
        }
    }

    return (
        <div className="flex bg-white font-sans fixed inset-0 overflow-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed top-0 left-0 min-h-screen max-h-screen bg-white border-r border-black/10 z-40 flex flex-col transition-all duration-300 ease-in-out w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 md:static md:z-auto ${collapsed ? 'md:w-[72px]' : 'w-full md:w-48'}`}
            >
                {/* Logo */}
                <div
                    className={`h-12 flex items-center border-b border-black/10 cursor-pointer transition-all duration-300 ease-in-out  ${collapsed ? 'md:justify-center md:px-0' : 'justify-between'
                        }`}
                    onClick={handleLogoClick}
                    role="button"
                    tabIndex={0}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleLogoClick()
                        }
                    }}
                >
                    <div className={`flex items-center overflow-hidden ${collapsed ? 'md:w-8' : ''}`}>
                        <img
                            src={`${collapsed ? Clogo : logo}`}
                            alt="Crescita admin logo"
                            className={`h-9 w-auto object-contain grayscale contrast-125 shrink-0 transition-transform duration-300 ease-in-out ${collapsed ? 'md:scale-95' : ''}`}
                        />
                    </div>

                    <button
                        className={`hidden md:flex items-center mt-1 justify-center h-7 w-7 rounded  text-gray-400 hover:bg-gray-100 hover:text-black transition-all duration-300 ${collapsed ? 'md:hidden' : ''
                            }`}
                        aria-label="Collapse sidebar"
                        onClick={(e) => {
                            e.stopPropagation()
                            setCollapsed(true)
                        }}
                    >
                        <ChevronsLeft size={16} />
                    </button>

                    <button
                        className="md:hidden text-gray-500 hover:text-black ml-auto"
                        aria-label="Close sidebar"
                        onClick={(e) => {
                            e.stopPropagation()
                            setSidebarOpen(false)
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>



                {/* Nav */}
                <nav
                    className={`flex-1 space-y-1 overflow-y-auto admin-nav-scroll transition-all duration-300 ease-in-out ${collapsed ? 'md:px-1 px-3 py-3 md:py-3' : 'md:px-2 px-3 py-3 md:py-5'
                        }`}
                >
                    {navItems.map(({ label, to, icon: Icon, highlight }) => (
                        <NavLink
                            key={to}
                            to={to}
                            title={collapsed ? label : undefined}
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    setSidebarOpen(false)
                                }
                            }}
                            className={({ isActive }) =>
                                `relative flex items-center text-[13.5px] transition-all duration-150 group
                                ${collapsed ? 'md:justify-center md:px-0 md:py-2.5' : 'px-3 py-2.5'}
                                ${isActive
                                    ? highlight
                                        ? 'bg-red-50 text-red-600 font-semibold'
                                        : 'bg-gray-200/60 text-black font-semibold'
                                    : highlight
                                        ? 'text-red-500 font-medium hover:bg-red-50 hover:text-red-600'
                                        : 'text-gray-600 font-medium hover:bg-gray-100 hover:text-black'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        className={`h-[18px] w-[18px] shrink-0 transition-colors duration-150 ${
                                            highlight
                                                ? isActive ? 'text-red-600' : 'text-red-400 group-hover:text-red-600'
                                                : isActive ? 'text-black' : 'text-gray-400 group-hover:text-black'
                                        }`}
                                    />
                                    <span
                                        className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${collapsed ? 'md:max-w-0 md:opacity-0 md:ml-0' : 'max-w-[140px] opacity-100 ml-3'
                                            }`}
                                    >
                                        {label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User / actions footer */}
                <div className="w-full border-t border-black/10 ">
                    <button className='flex items-center gap-2 w-full  px-4 py-2.5 pb-4 bg-red-50 hover:bg-red-100/60 text-red-600'>
                        <LogOut size={collapsed ? 18 : 16} className="shrink-0 mt-0.5" />
                        <span className={collapsed ? 'md:hidden' : 'hidden sm:inline'}>Log out</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <header className="bg-white sticky top-0 h-14 sm:h-12 px-1 sm:px-4  border-b border-black/10 flex items-center justify-between shrink-0">
                    <div className="w-full flex items-center justify-between gap-3 min-w-0">
                        <button
                            className="flex items-center cursor-pointer hover:opacity-85 transition-all duration-300 md:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Open sidebar"
                        >
                            <img src={logo} alt="Admin logo" className="h-8 object-contain grayscale contrast-125" />
                        </button>

                        <div className="hidden sm:flex items-center gap-2.5 px-1.5 py-1.5 ">
                            <p className="text-[15px] font-medium text-black truncate"> Admin Pannel</p>
                        </div>
                        <div className="flex items-center gap-3 ml-auto ml-4 ml-0">



                            <button className='hidden sm:flex items-center gap-2 w-full  px-3 py-1 bg-gray-100 text-gray-500 '>
                                <Home size={16} className="shrink-0" />
                                <span className={`font-semibold text-sm`}>View Store</span>
                            </button>

                            <Menu
                                size={20}
                                className="text-black cursor-pointer hover:opacity-70 sm:hidden transition-opacity"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            />
                        </div>
                    </div>
                </header >

                <main className="flex-1  flex flex-col bg-gray-50 overflow-y-auto admin-scrollbar">
                    {children}
                </main>
            </div >
        </div >
    )
}

export default MainLayout