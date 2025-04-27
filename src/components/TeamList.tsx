import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTeamData } from "../lib/api";
import { TeamResponse, Employee } from "../lib/types";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaClock,
  FaComment,
  FaUser,
  FaGlobe,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

// Function to calculate duration in hours
const calculateDuration = (
  checkIn: string,
  checkOut: string | null
): string => {
  if (!checkIn || !checkOut) return "In Progress";
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end.getTime() - start.getTime();
  const hours = (diffMs / (1000 * 60 * 60)).toFixed(1);
  return `${hours} hours`;
};

export default function TeamList() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"current_day" | "yesterday">(
    "current_day"
  );

  const { data, isLoading, isFetching, error, refetch } = useQuery<
    TeamResponse,
    Error
  >({
    queryKey: ["teamData"],
    queryFn: fetchTeamData,
    retry: 1,
    retryDelay: 1000,
  });

  const openModal = (employee: Employee, date: string) => {
    setSelectedEmployee(employee);
    setSelectedDate(date);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setSelectedDate(null);
    document.body.style.overflow = "auto";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-[var(--primary)] dark:border-[var(--primary-dark)] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-[var(--error)] text-center text-lg">
        Error: {error.message}
      </p>
    );
  }

  if (!data) {
    return <p className="text-center text-lg">No data available</p>;
  }

  const { team, attendance_data } = data;
  const { current_day, yesterday } = attendance_data;
  const activeData = activeTab === "current_day" ? current_day : yesterday;

  return (
    <div className="space-y-8 relative">
      {isFetching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-white dark:bg-gray-800 shadow-md rounded-full px-4 py-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-[var(--primary)] dark:border-[var(--primary-dark)] border-t-transparent rounded-full"
          />
          <span className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] font-normal">
            Loading...
          </span>
        </motion.div>
      )}

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
            {team.name}
          </h1>
          <motion.button
            onClick={() => refetch()}
            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Refresh team data"
          >
            <IoMdRefresh
              size={24}
              className={`cursor-pointer ${isFetching ? "animate-spin" : ""}`}
            />
          </motion.button>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <motion.button
          onClick={() => setActiveTab("current_day")}
          className={`py-2 px-4 text-base font-medium cursor-pointer ${
            activeTab === "current_day"
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Current Day ({current_day.date})
        </motion.button>
        <motion.button
          onClick={() => setActiveTab("yesterday")}
          className={`py-2 px-4 text-base font-medium cursor-pointer ${
            activeTab === "yesterday"
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Yesterday ({yesterday.date})
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === "current_day" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === "current_day" ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {activeData.employees.map((employee, index) => {
            const isStillWorking = !employee.checked_out_at;
            return (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)",
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                className="relative p-5 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden"
                onClick={() => openModal(employee, activeData.date)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openModal(employee, activeData.date);
                  }
                }}
                aria-label={`View attendance details for ${employee.name} on ${activeData.date}`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 opacity-0"
                  whileHover={{ opacity: 1, transition: { duration: 0.3 } }}
                />

                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  whileHover={{
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                    transition: { duration: 0.3 },
                  }}
                />

                {/* Card Content */}
                <motion.div
                  className="relative z-10"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  {/* Name and Status */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="relative">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <motion.span
                          className="text-blue-600"
                          whileHover={{
                            scale: [1, 1.2, 1],
                            transition: { duration: 0.5, repeat: Infinity },
                          }}
                        >
                          <FaUser />
                        </motion.span>
                        {employee.name}
                      </h3>
                      <motion.div
                        className="absolute -bottom-1 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 opacity-0"
                        whileHover={{
                          opacity: 1,
                          width: "50%",
                          transition: { duration: 0.3 },
                        }}
                      />
                    </div>
                    <motion.span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        isStillWorking
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                          : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300"
                      }`}
                      animate={
                        isStillWorking
                          ? {
                              scale: [1, 1.05, 1],
                              transition: { duration: 1.5, repeat: Infinity },
                            }
                          : {}
                      }
                    >
                      {isStillWorking ? (
                        <>
                          <FaHourglassHalf className="text-amber-700 dark:text-amber-300" />{" "}
                          Active
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="text-green-700 dark:text-green-300" />{" "}
                          Completed
                        </>
                      )}
                    </motion.span>
                  </div>

                  {/* Timezone */}
                  <p className="text-sm font-normal text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                    <motion.span
                      className="text-gray-500"
                      whileHover={{
                        scale: [1, 1.2, 1],
                        transition: { duration: 0.5, repeat: Infinity },
                      }}
                    >
                      <FaGlobe />
                    </motion.span>
                    Timezone: {employee.timezone}
                  </p>

                  {/* Hours Worked */}
                  <p className="text-sm font-normal text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                    <motion.span
                      className="text-gray-500"
                      whileHover={{
                        scale: [1, 1.2, 1],
                        transition: { duration: 0.5, repeat: Infinity },
                      }}
                    >
                      <FaClock />
                    </motion.span>
                    Duration:{" "}
                    {calculateDuration(
                      employee.checked_in_at!,
                      employee.checked_out_at
                    )}
                  </p>

                  {/* Checkout Message */}
                  {employee.checkout_message && (
                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-2 line-clamp-2">
                      <motion.span
                        className="text-gray-500"
                        whileHover={{
                          scale: [1, 1.2, 1],
                          transition: { duration: 0.5, repeat: Infinity },
                        }}
                      >
                        <FaComment />
                      </motion.span>
                      Note: {employee.checkout_message}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedEmployee && selectedDate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={closeModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.4, ease: [0.68, -0.55, 0.27, 1.55] }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl z-50 max-h-[90vh] overflow-hidden shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700"
              style={{
                boxShadow:
                  "0 0 20px rgba(59, 130, 246, 0.2), inset 0 0 10px rgba(59, 130, 246, 0.1)",
              }}
            >
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaUser className="text-white" /> {selectedEmployee.name}
                </h2>
                <motion.button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close modal"
                >
                  <IoClose className="cursor-pointer" size={24} />
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="p-6 space-y-4"
              >
                {/* Date */}
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaClock className="text-blue-600" />
                  <span>Date: {selectedDate}</span>
                </div>

                {/* Timezone */}
                <div className="flex items-center gap-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                  <FaGlobe className="text-blue-600" />
                  <span>Timezone: {selectedEmployee.timezone}</span>
                </div>

                {/* Check-in */}
                <div className="flex items-center gap-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                  <FaClock className="text-green-600" />
                  <span>
                    Check-in:{" "}
                    {selectedEmployee.checked_in_at
                      ? new Date(
                          selectedEmployee.checked_in_at
                        ).toLocaleString()
                      : "N/A"}
                  </span>
                </div>

                {/* Check-out */}
                <div className="flex items-center gap-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                  <FaClock className="text-red-600" />
                  <span>
                    Check-out:{" "}
                    {selectedEmployee.checked_out_at
                      ? new Date(
                          selectedEmployee.checked_out_at
                        ).toLocaleString()
                      : "In Progress"}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                  <FaClock className="text-blue-600" />
                  <span>
                    Duration:{" "}
                    {calculateDuration(
                      selectedEmployee.checked_in_at!,
                      selectedEmployee.checked_out_at
                    )}
                  </span>
                </div>

                {/* Note */}
                {selectedEmployee.checkout_message && (
                  <div className="flex items-start gap-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                    <FaComment className="text-purple-600 mt-0.5" />
                    <span className="flex-1">
                      Note: {selectedEmployee.checkout_message}
                    </span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
