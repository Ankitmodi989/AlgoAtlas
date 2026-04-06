import React from 'react'
import { useParams } from 'react-router-dom'
import MergeSort from '../Sorting_algo/MergeSort';
import QuickSort from '../Sorting_algo/QuickSort';

const Algo_page = () => {
    const{id}=useParams();

  
      if(id=="merge")
        return <MergeSort></MergeSort>
      else if(id=="quick")
        return <QuickSort></QuickSort>
   
  
}

export default Algo_page