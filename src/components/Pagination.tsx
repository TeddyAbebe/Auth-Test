import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers: number[] = [];
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <motion.button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-3 py-1 rounded-lg text-white transition-colors ${
          currentPage === 1
            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
            : "bg-blue-500 dark:bg-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500"
        }`}
      >
        &lt;&lt;
      </motion.button>

      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-3 py-1 rounded-lg text-white transition-colors ${
          currentPage === 1
            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
            : "bg-blue-500 dark:bg-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500"
        }`}
      >
        &lt;
      </motion.button>

      {pageNumbers.map((page) => (
        <motion.button
          key={page}
          onClick={() => onPageChange(page)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1 rounded-lg transition-colors ${
            page === currentPage
              ? "bg-blue-600 dark:bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-3 py-1 rounded-lg text-white transition-colors ${
          currentPage === totalPages
            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
            : "bg-blue-500 dark:bg-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500"
        }`}
      >
        &gt;
      </motion.button>

      <motion.button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-3 py-1 rounded-lg text-white transition-colors ${
          currentPage === totalPages
            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
            : "bg-blue-500 dark:bg-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500"
        }`}
      >
        &gt;&gt;
      </motion.button>
    </div>
  );
}
