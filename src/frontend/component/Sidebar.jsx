import React from 'react';
import { allCategories } from './Algo_List.jsx';
import './Sidebar.css';

const Sidebar = ({ activeCategory, setActiveCategory }) => {
    return (
        <aside className="sidebar h-screen sticky top-0 flex flex-col pt-6 pb-10 px-3 gap-1 border-r">
            
            {/* Section label */}
            <p className="sidebar__label text-xs font-semibold uppercase tracking-widest mb-3 px-2">
                Categories
            </p>

            {/* All button */}
            <button
                onClick={() => setActiveCategory('all')}
                className={`sidebar__btn ${activeCategory === 'all' ? 'sidebar__btn--active' : ''} flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-left`}
            >
                <span className="sidebar__icon">⊕</span>
                <span>All</span>
            </button>

            {/* Category buttons */}
            {allCategories.map((cat) => (
                <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`sidebar__btn ${activeCategory === cat.key ? 'sidebar__btn--active' : ''} flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-left`}
                >
                    <span className="sidebar__icon">{cat.icon}</span>
                    <span>{cat.label}</span>
                </button>
            ))}
        </aside>
    );
};

export default Sidebar;
