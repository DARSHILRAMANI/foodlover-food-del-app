// import React, { useEffect, useState } from "react";
// import "./List.css";
// import { url } from "../../assets/assets";
// import axios from "axios";
// import { toast } from "react-toastify";

// const List = () => {
//   const [list, setList] = useState([]);

//   const fetchList = async () => {
//     const response = await axios.get(`${url}/api/food/list`);
//     if (response.data.success) {
//       setList(response.data.data);
//     } else {
//       toast.error("Error");
//     }
//   };

//   const removeFood = async (foodId) => {
//     const response = await axios.post(`${url}/api/food/remove`, {
//       id: foodId,
//     });
//     await fetchList();
//     if (response.data.success) {
//       toast.success(response.data.message);
//     } else {
//       toast.error("Error");
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, []);

//   return (
//     <div className="list add flex-col">
//       <p>All Foods List</p>
//       <div className="list-table">
//         <div className="list-table-format title">
//           <b>Image</b>
//           <b>Name</b>
//           <b>Category</b>
//           <b>Price</b>
//           <b>Action</b>
//         </div>
//         {list.map((item, index) => {
//           return (
//             <div key={index} className="list-table-format">
//               <img src={item.image} alt="" />
//               <p>{item.name}</p>
//               <p>{item.category}</p>
//               <p>${item.price}</p>
//               <p className="cursor" onClick={() => removeFood(item._id)}>
//                 x
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default List;
import React, { useEffect, useState } from "react";
import "./List.css";
import { url } from "../../assets/assets"; // Ensure correct import
import axios from "axios";
import { toast } from "react-toastify";

const List = () => {
  const [list, setList] = useState([]);

  // Fetch the food list with error handling
  const fetchList = async () => {
    try {
      console.log("Fetching from:", url); // Debugging line
      const response = await axios.get(`${url}/api/food/list`);
      console.log("Response:", response.data); // Debugging line

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching data");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to fetch food list");
    }
  };

  // Remove food item from the list
  const removeFood = async (foodId) => {
    try {
      console.log("Removing item:", foodId); // Debugging line
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); // Refresh list after removing
      } else {
        toast.error("Error removing item");
      }
    } catch (error) {
      console.error("Remove API Error:", error);
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className="list-table-format">
              <img src={item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p className="cursor" onClick={() => removeFood(item._id)}>
                x
              </p>
            </div>
          ))
        ) : (
          <p className="no-data">No food items available</p>
        )}
      </div>
    </div>
  );
};

export default List;
