"use client";

import axios from "axios";
import Image from "next/image";
import React, {useState , useEffect} from "react";
import {PulseLoader} from 'react-spinners'



const page = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/schools")
      .then((response) => {
        console.log(response);
        setData(response.data);
           setLoading(false);
      })
      .catch((e) => console.log(e));
    
  }, []);
  return (
    <>
      <div className="p-[2vh] bg-black flex items-center gap-3 justify-center text-white border-b-white">
        <h1 className="lg:text-[1.6vw]"> School Search </h1>
        <Image
          src={"/schoolLogo.svg"}
          width={25}
          className="mb-1"
          height={25}
          alt=""
        />
      </div>
      <div className="p-[4vw] relative">
        {loading ? (
          <div className="flex gap-4 bg-white w-1/3 rounded-lg absolute top-[40vh] left-[33vw] md:w-1/6 lg:left-[45vw] md:left-[43vw] lg:w-[10vw] p-4 shadow-lg items-center justify-center">
            <h1 className="font-bold">Loading</h1>
            <PulseLoader color="#000000" size={'10px'}/>
          </div>
        ) : (
          <div className="gap-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.map((school) => {
              return (
                <>
                  <div className="fade-in bg-white shadow-xl rounded-xl lg:p-[1vw] p-[2vw] gap-4  flex flex-col">
                    <img className="" src={`/schoolImages/${school.image}`} />
                    <h1 className="font-bold lg:text-[1.1vw]">
                      {school.name} , <span>{school.city}</span>
                    </h1>
                    <div>
                      <h1 className="lg:text-[1.1vw]text-[1vw] font-bold text-gray-500 ">
                        {school.state}
                      </h1>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default page;
