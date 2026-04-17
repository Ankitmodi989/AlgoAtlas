import React, { useState, useRef } from 'react';
import Container from './Container';
import Sidebar from './Sidebar';
import { allAlgos, allCategories } from './Algo_List.jsx';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Content = ({ favour, toggleFavour }) => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const inputRef = useRef(null);

    // 1. filter by category
    const categoryFiltered =
        activeCategory === 'all'
            ? allAlgos
            : (allCategories.find((c) => c.key === activeCategory)?.algos ?? allAlgos);

    // 2. filter by search query on top of category
    const displayed = search
        ? categoryFiltered.filter((algo) =>
              algo.title.toLowerCase().includes(search.toLowerCase())
          )
        : categoryFiltered;

    // Label shown above cards
    const activeCatLabel =
        activeCategory === 'all'
            ? 'All Algorithms'
            : allCategories.find((c) => c.key === activeCategory)?.label ?? '';

    return (
        <div className="flex" style={{ minHeight: '100vh' }}>

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <Sidebar
                activeCategory={activeCategory}
                setActiveCategory={(cat) => {
                    setActiveCategory(cat);
                    setSearch('');          // clear search when switching category
                }}
            />

            {/* ── Main content ────────────────────────────────────── */}
            <div
                className="flex-1 w-full"
                style={{
                    backgroundImage: 'var(--background-image)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Hero / Search section */}
                <div className="flex flex-col items-center justify-center pt-20 pb-10 text-center px-4">
                    <h1 className="text-6xl font-bold">AlgoAtlas</h1>

                    <p className="text-lg text-gray-400 mt-4 max-w-2xl">
                        A comprehensive platform for exploring algorithms, offering structured
                        explanations, practice resources, and essential learning tools in one place.
                    </p>

                    {/* Search Bar */}
                    <div
                        onClick={() => inputRef.current.focus()}
                        className="flex items-center border backdrop-blur-md rounded-2xl mt-10 p-3 w-80 bg-white/10 shadow-lg"
                        style={{ borderColor: 'var(--serchbar-bg)' }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search Algorithm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="outline-none flex-1 px-2 bg-transparent"
                            style={{ color: 'var(--serchbar-color)' }}
                        />
                        <Search className="text-white" />
                    </div>
                </div>

                {/* Category heading */}
                <div className="px-10 mb-4">
                    <h2 className="text-2xl font-semibold" style={{ color: 'var(--card-text-color)' }}>
                        {activeCatLabel}
                        <span className="ml-3 text-base font-normal text-gray-400">
                            ({displayed.length})
                        </span>
                    </h2>
                </div>

                {/* Cards grid */}
                <div className="flex gap-10 flex-wrap justify-center px-5 pb-20">
                    {displayed.length > 0 ? (
                        displayed.map((ele, index) => (
                            <Link to={`/algo/${ele.id}`} key={index}>
                                <Container
                                    ele={ele}
                                    favour={favour}
                                    toggleFavour={toggleFavour}
                                />
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-400 mt-20">No algorithms found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Content;
