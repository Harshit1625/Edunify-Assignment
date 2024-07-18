"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Image from "next/image";
import { useState } from "react"
import { useRouter } from "next/navigation";

//using yup to create a validated schema
const schema = yup.object().shape({
  name: yup.string().required("School name is required"),
  address: yup.string().required("Address is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  contact: yup
    .number()
    .typeError("Contact must be a number")
    .required("Contact is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  image: yup.mixed().required("Image is required"),
});

const SchoolForm = () => {
  const [open, setOpen] = useState(false); //to make the button disabled during data submission
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("contact", data.contact);
    formData.append("image", data.image[0]);
    formData.append("email", data.email);
    console.log(formData);

    try {
      setOpen(true);
      await axios
        .post("/api/schools", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
          setOpen(false);
          router.push("/data");
        });
    } catch (error) {
      console.error("Failed to submit school data", error);
    }
  };

  return (
    <div className="relative flex items-center justify-center pl-[3vw] pr-[3vw]">
      <form
        className="bg-white shadow-lg rounded-xl flex flex-col gap-5 p-5 lg:p-9 mt-[10vh] lg:w-1/3 w-[90%] md:w-1/2 sm:w-1/2 transition-all"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-4 items-center justify-center">
          <h1 className="font-bold text-[20px] mt-1">Enter School Details</h1>
          <Image width={25} height={25} src={"/SchoolIcon.svg"} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold ml-1">Name</label>
          <input
            className="focus:outline-none border rounded-xl focus:border p-2"
            placeholder="Enter School Name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-600 ml-1">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold ml-1">Address</label>
          <input
            className="focus:outline-none border rounded-xl focus:border p-2"
            placeholder="Enter School Address"
            {...register("address")}
          />
          {errors.address && (
            <p className="text-red-600 ml-1">{errors.address.message}</p>
          )}
        </div>

        <div className="flex gap-2 justify-between">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold ml-1">State</label>
            <input
              className="focus:outline-none border rounded-xl focus:border p-2 w-full"
              placeholder="Enter State"
              {...register("state")}
            />
            {errors.state && (
              <p className="text-red-600 ml-1">{errors.state.message}</p>
            )}
          </div>

          <div className="flex flex-col w-full gap-2">
            <label className="font-bold ml-1">City</label>
            <input
              className="focus:outline-none border rounded-xl focus:border p-2 w-full"
              placeholder="Enter City"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-red-600 ml-1">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold ml-1">Contact Number</label>
            <input
              className="focus:outline-none border rounded-xl focus:border p-2 w-full"
              placeholder="Enter contact number"
              {...register("contact")}
            />
            {errors.contact && (
              <p className="text-red-600 ml-1">{errors.contact.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold ml-1">Email</label>
            <input
              className="focus:outline-none border rounded-xl focus:border p-2 w-full"
              placeholder="Enter school email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-600 ml-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-1/2">
            <label className="font-bold ml-1">Image</label>
            <input
              type="file"
              name="image"
              className="file:rounded-lg file:outline-none file:border file:border-dashed file:p-3 file:bg-white file:hover:bg-black file:hover:border-white file:hover:text-white transition-all file:opacity-40"
              {...register("image")}
            />
            {errors.image && (
              <p className="text-red-600 ml-1">{errors.image.message}</p>
            )}
          </div>
          <div className="w-full items-end justify-center flex">
            <button
              className={
                open
                  ? "p-3 pl-[3vw] rounded border-dashed bg-gray-500 text-white pr-[3.5vw]"
                  : "p-3 pl-[3vw] w-full rounded border-dashed text-white bg-black hover:border hover:border-black hover:bg-white hover:text-black transition-all pr-[3.5vw]"
              }
              type="submit"
              disabled={open}
            >
              {open ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SchoolForm;
