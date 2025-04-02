import { useState } from "react";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { updateNames } from "./userSlice";
import { useNavigate } from "react-router-dom";
import React from "react";

function CreateUser() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();
    if (username === "") return;

    dispatch(updateNames(username));
    navigate("/menu");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center px-4 sm:px-8 md:px-16"
    >
      <p className="mb-4 text-sm text-stone-600 sm:text-base md:text-lg ">
        👋 Hoş geldiniz! Lütfen adınızı yazarak başlayın:
      </p>

      <input
        type="text"
        placeholder="Adınız ve soyadınız"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input mb-8 w-full sm:w-72 md:w-96 lg:w-1/3"
      />

      {username !== "" && (
        <div>
          <Button type="primary">Alışverişe Başla</Button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;
