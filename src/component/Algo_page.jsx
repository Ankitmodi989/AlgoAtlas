import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ALGO_DATA } from '../Sorting_algo/AlgoData'
import AlgoTemplate from '../Sorting_algo/AlgoTemplate'
import MergeSort from '../Sorting_algo/MergeSort';
import QuickSort from '../Sorting_algo/QuickSort';

const CUSTOM_VISUALIZER = { merge: MergeSort, quick: QuickSort };

const Algo_page = () => {
  const { id } = useParams();
  const CustomComp = CUSTOM_VISUALIZER[id];
  if (CustomComp) return <CustomComp />;
  const data = ALGO_DATA[id];
  if (data) return <AlgoTemplate data={data} />;
  return (
    <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--card-text-color)', textAlign:'center', padding:'2rem' }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
      <h1 style={{ fontSize:24, fontWeight:700, marginBottom:8 }}>Algorithm not found</h1>
      <p style={{ opacity:0.5, fontSize:14, marginBottom:24 }}>"{id}" doesn't exist yet or is coming soon.</p>
      <Link to="/" style={{ color:'#3b82f6', fontWeight:600, fontSize:14, textDecoration:'none', border:'1px solid #3b82f655', borderRadius:8, padding:'8px 20px' }}>← Back to all algorithms</Link>
    </div>
  );
};

export default Algo_page;
