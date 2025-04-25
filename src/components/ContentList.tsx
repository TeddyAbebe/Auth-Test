import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPosts } from "../lib/api";
import { Post } from "../lib/types";
import { useState, useEffect } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import Pagination from "./Pagination";
import { IoClose } from "react-icons/io5";
import { FaHeart, FaComment } from "react-icons/fa";

const DEFAULT_IMAGE =
  "https://placehold.co/600x400/4B5EAA/FFFFFF?text=No+Cover+Image";

export default function ContentList() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const perPage = 5;
  const maxPages = 10;

  const { data, isLoading, isFetching, error } = useQuery<Post[], Error>({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page),
    retry: 1,
    retryDelay: 1000,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data) {
      if (data.length < perPage) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [data, perPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const totalPages = hasMore ? Math.max(page, maxPages) : page;

  const openModal = (post: Post) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  if (isLoading && !data) {
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

  return (
    <div className="space-y-6 relative">
      {isFetching && data && (
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
          <span className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)]">
            Loading...
          </span>
        </motion.div>
      )}

      <div className="relative">
        {isFetching && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 flex items-center justify-center"
          />
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((post: Post, index: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{
                scale: 1.02,
                y: -3,
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              className="p-6 card relative rounded-lg cursor-pointer overflow-hidden flex flex-col justify-between"
              onClick={() => openModal(post)}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0"
                whileHover={{ opacity: 0.6, transition: { duration: 0.2 } }}
              />

              <img
                src={post.cover_image || DEFAULT_IMAGE}
                alt={post.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />

              <h3 className="text-lg font-medium text-white mb-2">
                {post.title}
              </h3>

              <p className="text-sm text-white mb-2">
                By {post.user.name}
                {post.organization && <span> • {post.organization.name}</span>}
              </p>

              <p className="text-sm text-white mb-2">
                {post.readable_publish_date} • {post.reading_time_minutes} min
                read
              </p>

              <p className="text-sm text-white line-clamp-3 mb-4">
                {post.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tag_list.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-200 dark:bg-gray-700 text-white px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 text-sm text-white">
                <motion.span
                  className="flex items-center gap-1"
                  whileHover={{
                    y: [0, -3, 0],
                    transition: { duration: 0.3, repeat: 1 },
                  }}
                >
                  <FaHeart className="text-red-600" />{" "}
                  {post.positive_reactions_count} reactions
                </motion.span>
                <motion.span
                  className="flex items-center gap-1"
                  whileHover={{
                    y: [0, -3, 0],
                    transition: { duration: 0.3, repeat: 1 },
                  }}
                >
                  <FaComment /> {post.comments_count} comments
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {data && data.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      <AnimatePresence>
        {selectedPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={closeModal}
            />

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 cursor-pointer hover:bg-gray-600 rounded-sm p-1 text-[var(--text-light)] dark:text-[var(--text-dark)]"
              >
                <IoClose size={24} />
              </button>

              <div className="space-y-4">
                {selectedPost.cover_image && (
                  <img
                    src={selectedPost.cover_image || DEFAULT_IMAGE}
                    alt={selectedPost.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <h2 className="text-2xl font-bold text-[var(--text-light)] dark:text-[var(--text-dark)]">
                  {selectedPost.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By {selectedPost.user.name}
                  {selectedPost.organization && (
                    <span> • {selectedPost.organization.name}</span>
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedPost.readable_publish_date} •{" "}
                  {selectedPost.reading_time_minutes} min read
                </p>
                <p className="text-base text-[var(--text-light)] dark:text-[var(--text-dark)]">
                  {selectedPost.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tag_list.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-200 dark:bg-gray-700 text-[var(--text-light)] dark:text-[var(--text-dark)] px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaHeart className="text-red-600" />{" "}
                    {selectedPost.positive_reactions_count} reactions
                  </span>
                  <span className="flex items-center gap-1">
                    <FaComment /> {selectedPost.comments_count} comments
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
