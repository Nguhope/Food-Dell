import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import './list.css'

const List = ({url}) => {
  
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch the food list.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the food list.");
      console.error("Fetch error:", error);
    }
  };
  const removeFood = async (foodId) =>{
    const response = await axios.post(`${url}/api/food/remove` , {id:foodId})
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message)
    }
    else{
      toast.error("error");
    }


  }



  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.length > 0 ? (
          list.map((item) => (
            <div key={item._id} className="list-table-format">
              <img src={`${url}/images/${item.image}`} alt= "" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p className="cursor" onClick={() =>removeFood(item._id)}>X</p>
            </div>
          ))
        ) : (
          <p className="empty-message">No food items available.</p>
        )}
      </div>
    </div>
  );
};

export default List;
