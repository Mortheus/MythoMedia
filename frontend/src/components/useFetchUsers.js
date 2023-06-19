import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";

const useFetchUsers = () => {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/get-users');
        setUsers(response.data);
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

    return {users, isLoading};
}

export default useFetchUsers;