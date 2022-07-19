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

function ToDoList() {
  const { register, handleSubmit, formState } = useForm();
  const onValid = (data: any) => {
    console.log(data)
  };
  console.log(formState.errors);

  return (
    <div>
      <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit(onValid)}>
        <input {...register("email", { required: "email is required" })} placeholder="Write a to email" />
        <input {...register("firstName", { required: true })} placeholder="Write a to firstname" />
        <input {...register("lastName", { required: true })} placeholder="Write a to lastname" />
        <input {...register("username", { required: true, minLength: {
          value: 10,
          message: "username too short"
        }
         })} placeholder="Write a to username" />
        <input {...register("password", { required: true, minLength: 5 })} placeholder="Write a to password" />
        <input {...register("password1", { required: true, minLength: 5 })} placeholder="Write a to password1" />

        <button>Add</button>
      </form>
    </div>
  )
};

export default ToDoList;