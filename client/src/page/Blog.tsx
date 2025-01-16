// import "../index.css"
import { useEffect, useState } from "react";

import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EditBlog from "./EditBlog";


const Blog = () => {
  const params = useParams<{ id: string }>();
  const [apiData, setApiData] = useState<null | { title: string; post: string }>(null);

    useEffect(() => {
      const fetchData = async() => {
        try {
          const apiUrl = `${import.meta.env.VITE_API_ROOT}/${params.id}`;
          if(!apiUrl) {
            throw new Error("Environement variables for API are not defined! ")
          }
          const response = await axios.get(apiUrl);

          if (response.status === 200) {
            if (response?.data.statusText === "Ok") {
              setApiData(response?.data?.record);
            }
          }
        } catch (error) {
          console.log("Error fetching data:",error);
        }      
      };
    fetchData();
    return () => {}
    }, [params.id]);

  const handleUpdate = (updatedBlog: { title: string; post: string }) => {
    setApiData((prev) => {
      if (prev) {
        return {
          ...prev,
          title: updatedBlog.title,
          post: updatedBlog.post,
        };
      }
      return updatedBlog;
    });
    console.log("Updated API data:", apiData);
  };
  
  
  return (
    <div className="max-w-4xl mx-auto flex flex-col min-h-screen p-6 space-y-4">
      <div className="w-full flex flex-row justify-between">
        <div className="flex w-full flex-row justify-start items-center space-x-2 mb-5">
          <Link to="/">
            <ArrowLeft className="size-4 text-zinc-500" />
          </Link>
          <span className="text-sm text-zinc-500">Go Back</span>
        </div>
        <div className="flex justify-end w-full max-w-4xl mb-4">
          {apiData && params.id && (
            <EditBlog
              blogId={params.id}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </div>
      
      {apiData ? (
        <>
          <h1 className="text-lg">{apiData.title}</h1>
          <p className="text-justify">{apiData.post}</p>
        </>
      ) : (
        <p className="text-start">Loading...</p>
      )}
      
    </div>
  )
}

export default Blog