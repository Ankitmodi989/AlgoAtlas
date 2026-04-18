import React from 'react';
import { Heart, PlayCircle, BookOpen } from 'lucide-react';

const Container = ({ ele, favour, toggleFavour }) => {
    const handleLink = (e, url) => {
        e.preventDefault();
        e.stopPropagation();
        if (url) window.open(url, '_blank');
    };

    return (
        <div
            className="p-5 rounded-2xl w-80 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-color)' }}
        >
            <img src={ele.image} alt={ele.title} className="rounded-xl h-40 w-full object-cover" />

            <div className="flex mt-3 justify-between">
                <h2 className="text-2xl font-bold">{ele.title}</h2>
                <Heart
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavour(ele); }}
                    className={`${favour.some(item => item.id === ele.id) ? 'text-red-500 fill-red-500' : 'text-white'}`}
                />
            </div>

            <p className="text-gray-400 text-sm mt-1">{ele.shortDescription}</p>

            <div className="mt-3">
                <h3 className="font-semibold text-yellow-400">Time Complexity:</h3>
                <p className="text-sm">Best: {ele.timeComplexity.best} | Avg: {ele.timeComplexity.avg} | Worst: {ele.timeComplexity.worst}</p>
            </div>

            <div className="mt-2">
                <h3 className="font-semibold text-green-400">Space Complexity:</h3>
                <p className="text-sm">{ele.spaceComplexity}</p>
            </div>

            <div className="flex gap-2 mt-3">
                <button
                    onClick={(e) => handleLink(e, ele.youtubeLink)}
                    disabled={!ele.youtubeLink}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium hover:opacity-80"
                    style={{ backgroundColor: ele.youtubeLink ? '#dc2626' : '#374151', color: '#fff', opacity: ele.youtubeLink ? 1 : 0.5, cursor: ele.youtubeLink ? 'pointer' : 'not-allowed' }}
                >
                    <PlayCircle size={13} /> YouTube
                </button>
                <button
                    onClick={(e) => handleLink(e, ele.docsLink)}
                    disabled={!ele.docsLink}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium hover:opacity-80"
                    style={{ backgroundColor: ele.docsLink ? '#2f8d46' : '#374151', color: '#fff', opacity: ele.docsLink ? 1 : 0.5, cursor: ele.docsLink ? 'pointer' : 'not-allowed' }}
                >
                    <BookOpen size={13} /> GFG
                </button>
            </div>

            <div className="flex justify-between mt-3 text-sm">
                <span className="bg-blue-500 px-2 py-1 rounded">{ele.category}</span>
                <span className="bg-purple-500 px-2 py-1 rounded">{ele.difficulty}</span>
            </div>
        </div>
    );
};

export default Container;
