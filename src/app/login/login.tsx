"use client";

import { useRouter } from "next/navigation"; // für App Router (Next.js 13+)
import { loginUser } from "@/lib/auth";
import { useState } from "react";
import { loginSchema } from "../../../BackEnd/Joi";

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");


  const router = useRouter();
  
  const handleRegister = async () => {
    const formData = { email, password };
    const { error, value } = loginSchema.validate(formData);

    if (error) {
      setErrorMsg(error.details[0].message);
      return;
    }

    try {
      await loginUser(value.email, value.password);
      router.push("/"); 
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <input
        className="p-[2vh] m-[2vh] bg-gray-500"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />
      <input
        className="p-[2vh] m-[2vh] bg-gray-500"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />
      <p onClick={handleRegister}>Login</p>
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
    </div>
  );
}
