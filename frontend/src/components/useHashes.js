import { useState, useEffect } from "react";
import { fetchHashes, refreshToken } from "./apiServices";
import { useNavigate } from "react-router-dom";

// Custom hook that fetches the hashes from the API and handles the token refresh.

const useHashes = (currentUser) => {
  const navigate = useNavigate();
  const [hashData, setHashData] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        const data = await fetchHashes();
        setHashData(data);
      } catch (error) {
        handleFetchError(error);
      }
    };

    const handleFetchError = async (error) => {
      if (error.response && error.response.status === 401) {
        try {
          const tokenData = await refreshToken();
          localStorage.setItem("access_token", tokenData.access);
          fetchData();
        } catch (refreshError) {
          if (
            refreshError.response &&
            (refreshError.response.status === 401 ||
              refreshError.response.status === 403)
          ) {
            navigate("/login");
          } else {
            alert(
              `Error refreshing token: ${JSON.stringify(
                refreshError.response.data
              )}`
            );
          }
        }
      } else {
        alert(`Error fetching data: ${JSON.stringify(error.response.data)}`);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  return [hashData, setHashData];
};

export default useHashes;
