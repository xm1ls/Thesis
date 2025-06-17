import { useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import { Link } from "react-router-dom";
import { UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const { login } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();

    login(formData);

    setFormData({
        name: "",
        password: ""
    });
  };
  
  return (
    <div className="flex flex-grow justify-center items-center">
      <form onSubmit={handleSubmit} action="login" className="flex flex-col items-center shadow-xl min-w-100 h-fit border-1 border-base-300 rounded-md p-10">
        <UserCheck className="mb-10" size={50} color="#bbb"/>
        <input
          type="input"
          className="input validator p-6 mb-5"
          required
          placeholder="Username"
          pattern="[A-Za-z][A-Za-z0-9\-]*"
          minlength="3"
          maxlength="30"
          title="Only letters, numbers or dash"
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
        />
        {/* <p className="validator-hint">
          Must be 3 to 30 characters
          <br />
          containing only letters, numbers or dash
        </p> */}

        <input
          type="password"
          className="input validator p-6 mb-10"
          required
          placeholder="Password"
        //   minlength="8"
        //   pattern="([a-z])"
        //   title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
          }}
        />
        {/* <p className="validator-hint">
          Must be more than 8 characters, including
          <br />
          At least one number
          <br />
          At least one lowercase letter
          <br />
          At least one uppercase letter
        </p> */}
        <button type="submit" className="btn w-full shadow-md p-5">Login</button>
        <div className="divider mt-5 mb-3"></div>
        <Link to="/signup" className="link text-md">
            Sign Up
        </Link>
      </form>

    </div>
  );
};

export default LoginPage;
