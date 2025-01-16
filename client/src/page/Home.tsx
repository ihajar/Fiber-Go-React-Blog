import { useEffect, useState } from "react";

import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";

import "../index.css"
import { Link } from "react-router-dom";
import {EditIcon, Loader, TrashIcon } from "lucide-react";
import AddBlog from "./AddBlog";
import { Button } from "@/components/ui/button";
import DeleteBlog from "./DeleteBlog";

const Home = () => {
    const [apiData, setApiData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchData = async() => {
        
        try {
          const apiUrl = import.meta.env.VITE_API_ROOT;
          if(!apiUrl) {
            throw new Error("Environement variables for API is not defined! ")
          }
          const response = await axios.get(apiUrl);

          if (response.status === 200) {
            if (response?.data.statusText === "Ok") {
              setApiData(response?.data?.blog_records);
            }
          }
          setLoading(false);
        } catch (error) {
          console.log("Error fetching data:",error);
        }      
      };
    fetchData();
    return () => {}
    }, []);

  const handleAddBlog = (newBlog: any) => {
    setApiData((prev) => [newBlog, ...prev]);
  };

  const handleDeleteBlog = (deletedBlogId: string) => {
    setApiData((prev) => prev.filter((blog) => blog.id != deletedBlogId));
  };

  if (loading) {
    return (
      <>
        <Loader className="size-5 text-zinc-700" />
      </>
    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className='flex flex-col items-center justify-center h-full w-full px-4'>
        <div className='flex-col col-span-12 py-2 mb-4'>
          <h1 className='font-bold text-center text-xl'>React Web App with Go Fiber Backend</h1>
        </div>
        <div className="flex justify-end w-full max-w-4xl mb-4">
          <AddBlog onAdd={handleAddBlog} />
        </div>
        {apiData && apiData.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl'>
          {apiData.map((record, index) => (
            <Card key={index} className='flex flex-col'>
              <CardContent>
                <CardTitle className='font-semibold text-xl hover:text-emerald-600 py-4'>
                  <Link to={`blog/${record.id}`}>
                    {record.title}
                  </Link>
                </CardTitle>
                <CardDescription className='text-gray-600'>{record.post}</CardDescription>
              </CardContent>
              <CardFooter className="w-full flex justify-between space-x-3">
                <Button variant="outline">
                  <Link to={`blog/${record.id}`} className="flex flex-row justify-start gap-x-2">
                    <EditIcon className="size-5 text-emerald-600" />
                    <span className="text-emerald-600">Edit</span>
                  </Link>
                </Button>
                {/* Integrating deleteBlog here */}
                {/* <Button variant='destructive' className="flex flex-row justify-start gap-x-2">
                  <TrashIcon className="size-5" />
                  <span>Delete</span>
                </Button> */}
                <DeleteBlog blogId={record.id} onDelete={handleDeleteBlog} />
              </CardFooter>
            </Card>
          ))}
          </div>
        ): (
          <div className='text-gray-500 flex flex-row w-full gap-x-2'>
            <Loader className="size-4 text-gray-600" />
            <span className="text-gray-600">No data available</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home