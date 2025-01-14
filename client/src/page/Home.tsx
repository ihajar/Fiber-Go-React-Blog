import { useEffect, useState } from "react";

import axios from "axios";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

import "../index.css"
import { Link } from "react-router-dom";

const Home = () => {
    const [apiData, setApiData] = useState<any[]>([]);

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
      } catch (error) {
        console.log("Error fetching data:",error);
      }      
    };
    fetchData();
  }, []);

  console.log(apiData);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className='flex flex-col items-center justify-center h-full w-full px-4'>
        <div className='flex-col col-span-12 py-2 mb-4'>
          <h1 className='font-bold text-center text-lg'>React Web App with Go Fiber Backend</h1>
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
            </Card>
          ))}
          </div>
        ): (
          <div className='text-gray-500'>
            No data available
          </div>
        )}
      </div>
    </div>
  )
}

export default Home