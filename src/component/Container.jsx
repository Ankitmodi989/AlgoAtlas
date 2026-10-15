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
            className="p-5 rounded-2xl w-80 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border backdrop-blur-md flex flex-col justify-between"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-color)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
        >
            <div>
                <img src={ele.image} alt={ele.title} className="rounded-xl h-40 w-full object-cover" />

                <div className="flex mt-3 justify-between items-center">
                    <h2 className="text-xl font-bold">{ele.title}</h2>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavour(ele); }}
                        className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        title={favour.some(item => item.id === ele.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart
                            size={22}
                            className={`transition-colors ${
                                favour.some(item => item.id === ele.id)
                                    ? 'text-red-500 fill-red-500'
                                    : 'text-gray-400 hover:text-red-400'
                            }`}
                        />
                    </button>
                </div>

                <p className="opacity-75 text-sm mt-1 line-clamp-2">{ele.shortDescription}</p>

                <div className="mt-3">
                    <h3 className="font-semibold text-amber-500 text-xs uppercase tracking-wider">Time Complexity</h3>
                    <p className="text-xs mt-0.5 opacity-90">
                        {ele.timeComplexity?.best ? (
                            <>Best: <code>{ele.timeComplexity.best}</code> | Avg: <code>{ele.timeComplexity.avg}</code> | Worst: <code>{ele.timeComplexity.worst}</code></>
                        ) : (
                            <code>{typeof ele.timeComplexity === 'string' ? ele.timeComplexity : 'O(n)'}</code>
                        )}
                    </p>
                </div>

                <div className="mt-2">
                    <h3 className="font-semibold text-emerald-500 text-xs uppercase tracking-wider">Space Complexity</h3>
                    <p className="text-xs mt-0.5 opacity-90"><code>{ele.spaceComplexity}</code></p>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex gap-2">
                    <button
                        onClick={(e) => handleLink(e, ele.youtubeLink)}
                        disabled={!ele.youtubeLink}
                        title={ele.youtubeLink ? "Watch Video Tutorial" : "No video link available"}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity"
                        style={{ backgroundColor: ele.youtubeLink ? '#dc2626' : '#6b7280', color: '#fff', opacity: ele.youtubeLink ? 1 : 0.4, cursor: ele.youtubeLink ? 'pointer' : 'not-allowed' }}
                    >
                        <PlayCircle size={14} /> Video
                    </button>
                    <button
                        onClick={(e) => handleLink(e, ele.docsLink)}
                        disabled={!ele.docsLink}
                        title={ele.docsLink ? "Read Docs" : "No docs link available"}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity"
                        style={{ backgroundColor: ele.docsLink ? '#16a34a' : '#6b7280', color: '#fff', opacity: ele.docsLink ? 1 : 0.4, cursor: ele.docsLink ? 'pointer' : 'not-allowed' }}
                    >
                        <BookOpen size={14} /> Docs
                    </button>
                </div>

                <div className="flex justify-between items-center mt-3 text-xs font-medium">
                    <span className="bg-indigo-600/90 text-white px-2.5 py-0.5 rounded-md">{ele.category}</span>
                    <span className="bg-purple-600/90 text-white px-2.5 py-0.5 rounded-md">{ele.difficulty}</span>
                </div>
            </div>
        </div>
    );
};

export default Container;
