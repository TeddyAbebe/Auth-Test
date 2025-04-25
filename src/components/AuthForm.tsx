import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { signup, login } from "../lib/api";
import { useAuthStore } from "../lib/store";
import { AuthFormData } from "../lib/types";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AuthForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<AuthFormData>();
  const [error, setError] = useState("");
  const [formType, setFormType] = useState<"signup" | "login">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setError("");
    try {
      const user = { email: data.email, password: data.password };
      if (formType === "signup") {
        await signup(user);
        await login(user);
      } else {
        await login(user);
      }
      setUser(user);
      navigate("/home");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (formType === "signup" && err.message.includes("already exists")) {
        setFormType("login");
        setError("User already exists. Please log in.");
        reset({ email: data.email, password: "", confirmPassword: "" });
      } else {
        setError(err.message || "An error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFormType = () => {
    setFormType(formType === "signup" ? "login" : "signup");
    setError("");
    reset({ email: "", password: "", confirmPassword: "" });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 card"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        {formType === "signup" ? "Create Account" : "Log In"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-lg font-medium mb-1 text-white">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 text-white placeholder-[var(--placeholder-light)] dark:placeholder-[var(--placeholder-dark)] focus:bg-gray-100 dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-xl"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-lg text-[var(--error)]">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="relative">
          <label className="block text-lg font-medium mb-1 text-white">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength:
                formType === "signup"
                  ? {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    }
                  : undefined,
            })}
            className="w-full p-3 pr-10 rounded-lg bg-white dark:bg-gray-700 text-white placeholder-[var(--placeholder-light)] dark:placeholder-[var(--placeholder-dark)] focus:bg-gray-100 dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-xl"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute cursor-pointer inset-y-0 right-3 flex items-center top-7 text-white hover:text-gray-700 dark:hover:text-gray-300"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && (
            <p className="mt-1 text-lg text-[var(--error)]">
              {errors.password.message}
            </p>
          )}
        </div>

        {formType === "signup" && (
          <div className="relative">
            <label className="block text-lg font-medium mb-1 text-white">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="w-full p-3 pr-10 rounded-lg bg-white dark:bg-gray-700 text-white placeholder-[var(--placeholder-light)] dark:placeholder-[var(--placeholder-dark)] focus:bg-gray-100 dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-xl"
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute cursor-pointer inset-y-0 right-3 flex items-center top-7 text-white hover:text-gray-700 dark:hover:text-gray-300"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-lg text-[var(--error)]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        {error && (
          <p className="text-[var(--error)] text-lg text-center">{error}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-500 dark:bg-blue-400 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-sm text-xl"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-4 border-white border-t-transparent rounded-full mx-auto"
            />
          ) : formType === "signup" ? (
            "Sign Up"
          ) : (
            "Log In"
          )}
        </motion.button>
      </form>

      <p className="mt-4 text-lg text-center text-white">
        {formType === "signup"
          ? "Already have an account? "
          : "Need an account? "}
        <button
          type="button"
          onClick={toggleFormType}
          className="text-blue-500 dark:text-blue-400 hover:underline"
        >
          {formType === "signup" ? "Log In" : "Sign Up"}
        </button>
      </p>
    </motion.div>
  );
}
