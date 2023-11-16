import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { axiosInstance } from "axios.config";
import { userNameState } from "globalState/recoilState";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

interface IName {
  Name: string;
}

function ChangeUsername({ userId }: { userId: string }) {
  const [userName, setUserName] = useRecoilState(userNameState);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IName>();

  const changeName: SubmitHandler<IName> = async (userData) => {
    try {
      const { data }: { data: { message: string; error: boolean } } =
        await axiosInstance.post("user/change_name", {
          name: userData.Name.trim(),
          id: userId,
        });
      if (data.error) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        setUserName(userData.Name);
        setValue("Name", "");
      }
    } catch (error: any) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    }
  };

  return (
    <>
      <h2 className="uppercase text-xl mx-auto">Change Name</h2>
      <form onSubmit={handleSubmit(changeName)}>
        <input
          type="text"
          placeholder="New username"
          className="border-2 px-1 py-1 mt-1 rounded-md block w-full text-black"
          {...register("Name", {
            required: true,
            validate: (value: string) =>
              value.replace(/\s+/g, " ").trim().length > 2,
          })}
        />
        {errors.Name && <p className="text-red-500 mt-1">Invalid name</p>}
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md mt-4 uppercase w-full">
          Save
        </button>
        <hr className="m-10 w-full mx-auto h-1 bg-gray-500" />
      </form>
    </>
  );
}

export default ChangeUsername;
