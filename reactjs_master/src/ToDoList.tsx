import React, { useState } from "react";
import { useForm } from "react-hook-form";

// function ToDoList() {
// 	const [toDo, setToDo] = useState("");
// 	const [toDoError, setToDoError] = useState("");
// 	const onChange = (event: React.FormEvent<HTMLInputElement>) => {
// 		const {
// 			currentTarget: { value },
// 		} = event;
// 		setToDoError("");
// 		setToDo(value);
// 	};
// 	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
// 		event.preventDefault();
// 		if(toDo.length < 10) {
// 			return setToDoError("To do should be longer");
// 		}
// 		console.log("submit");
// 	};
// 	return (
// 		<div>
// 			<form onSubmit={onSubmit}>
// 				<input onChange={onChange} value={toDo} placeholder="Write a to do" />
// 				<button>Add</button>
// 				{toDoError !=="" ? toDoError : null}
// 			</form>
// 		</div>
// 	);
// }

interface IForm {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  password1: string;
  extraError?: string;
}

function ToDoList() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IForm>({
    defaultValues: {
      email: "@naver.com",
    },
  });
  const onValid = (data: IForm) => {
    if (data.password !== data.password1) {
      setError("password1", { message: "Password are not the same" }, { shouldFocus: true });
    }
    //setError("extraError", { message: "Server offline." });
  };
  console.log(errors);

  return (
    <div>
      <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit(onValid)}>
        <input {...register("email", {
          required: "eamil required",
          pattern: {
            value: /^[A-Za-z0-9._%+-]+@naver.com$/,
            message: "Only naver.com emails allowed",
          }
        })}
          placeholder="Write a to email" />
        <span>{errors?.email?.message}</span>

        <input {...register("firstName", { 
          required: "firstname required", 
          validate: (value) => value.includes("nico") ? "no nico allowed" : true,
          })} placeholder="Write a to firstname" />
        <span>{errors?.firstName?.message}</span>

        <input {...register("lastName", { required: "lastname required" })} placeholder="Write a to lastname" />
        <span>{errors?.lastName?.message}</span>

        <input {...register("username", {
          required: "username required", minLength: {
            value: 10,
            message: "username too short"
          }
        })} placeholder="Write a to username" />
        <span>{errors?.username?.message}</span>

        <input {...register("password", { required: "password required", minLength: 5 })} placeholder="Write a to password" />
        <span>{errors?.password?.message}</span>

        <input {...register("password1", {
          required: "password1 required", minLength: {
            value: 5,
            message: "Your password is too short.",
          },
        })} placeholder="Write a to password1" />
        <span>{errors?.password1?.message}</span>

        <button>Add</button>
        <span>{errors?.extraError?.message}</span>
      </form>
    </div>
  )
};

export default ToDoList;