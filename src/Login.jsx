import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./features/api/authApiSlice";

export default function Login() {
  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [isChecked, setischecked] = useState(true);
  const handleCheckboxChange = () => setischecked(!isChecked);

  const [login, { isLoading, isError, error }] = useLoginMutation(); // RTK Query hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setform((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const login_payloadData = {
      userName: form.email,
      password: form.password,
      deviceType: "string",
      deviceAddress: "string",
    };

    try {
      const response = await login(login_payloadData).unwrap(); // unwrap gets plain response
      localStorage.setItem("token", response.token);

      if (response.isSuccess) {
        navigate("/home");
      }
    } catch (err) {
      console.error("Login failed", err?.data || err.message);
    }
  };

  return (
    <div className="flex flex-row min-h-screen ">
      
      <div className=" flex items-center w-full">
        <div className="mx-auto  w-3/12  border p-4 rounded-md border-rose-800 border-3">
          <h1 className="font-bold text-3xl">Login With Your Account</h1>
          <h1 className="font-thin text-sm">
            See what is going on with your business
          </h1>
          <form onSubmit={handleSubmit} className="grid gap-3 mt-6">
            <label className="grid">
              Email
              <input
                type="email"
                className="outline-none border-1 border-gray-300 text-gray-800 rounded-md p-2"
                value={form.email}
                name="email"
                onChange={handleChange}
                placeholder="john@gmail.com"
              />
            </label>
            <label className="grid">
              Password
              <input
                type="password"
                className="outline-none border-1 border-gray-300  rounded-md p-2"
                value={form.password}
                name="password"
                onChange={handleChange}
                placeholder="xxxx-xxxx"
              />
            </label>
            {isError && (
              <p className="text-red-600 text-sm mt-1">
                Login failed: {error?.data?.message || error?.error}
              </p>
            )}
          </form>
          <div className="flex justify-between items-center my-6">
            <label>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="mr-1"
              />
              Remember me
            </label>
            <h1 className="text-rose-800  text-sm font-medium">
              Forgot Password?
            </h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="text-white bg-rose-800 w-full shadow-md  p-2 rounded-md"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
   
    </div>
  );
}
