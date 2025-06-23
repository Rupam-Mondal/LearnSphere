import axios from "axios";
import React, { useEffect } from "react";

const StudentFeed = () => {
  useEffect(() => {
    const getFeed = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in localStorage.");
        return;
      }

      try {
        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/student/feed",
          { token }
        );
        console.log("Student Feed:", response.data);
      } catch (error) {
        console.error("Error fetching student feed:", error);
      }
    };

    getFeed();
  }, []);

  return <div>Feed</div>;
};

export default StudentFeed;
