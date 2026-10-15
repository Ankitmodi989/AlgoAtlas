import React from 'react';
import { Link } from 'react-router-dom';
import Container from './Container';

const Favour = ({ favour, toggleFavour }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            My Wishlist & Favorites
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Algorithms you've saved for quick reference and study
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/30 font-semibold">
          {favour.length} {favour.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {favour.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🤍</div>
          <h2 className="text-xl font-bold mb-2">No favorites added yet</h2>
          <p className="text-sm opacity-70 max-w-md mb-6">
            Click the heart icon on any algorithm card to save it to your wishlist for quick access anytime.
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-lg hover:shadow-indigo-500/25"
          >
            Explore Algorithms
          </Link>
        </div>
      ) : (
        <div className="flex gap-8 flex-wrap justify-center sm:justify-start">
          {favour.map((ele) => (
            <Link to={`/algo/${ele.id}`} key={ele.id}>
              <Container
                ele={ele}
                favour={favour}
                toggleFavour={toggleFavour}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favour;