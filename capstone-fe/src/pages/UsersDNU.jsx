import React, {useEffect, useState} from 'react'
import axios from "axios"

function Users({token}) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios("`${import.meta.env.VITE_API_BASE_URL}/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        console.log(data);
        setUserData(data.data);

      })
      .catch((err) => console.log(err));
  }, [token]);

  // const handleEditProfile= async (id) => {
  //   try {
  //     const data = await axios.
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <div>Welcome!! {userData?.username}</div>
  )
}

export default Users;