import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchData } from "../redux/userSlice";

const Search = () => {
  const { searchData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = async () => {
    if (!input.trim()) {
      dispatch(setSearchData([]));
      return;
    }

    try {
      setLoading(true);
      const result = await axios.get(
        `${baseUrl}/api/user/search?keyword=${encodeURIComponent(input)}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(result.data.users || []));
    } catch (error) {
      console.error("Search error:", error.response?.data || error.message);
      dispatch(setSearchData([]));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debounce search: waits 400ms after user stops typing
  useEffect(() => {
    const delay = setTimeout(() => {
      handleSearch();
    }, 400);

    return () => clearTimeout(delay);
  }, [input]);

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-6 flex justify-center">
      {/* Container with max width for large screens */}
      <div className="w-full max-w-xl">
        {/* Top bar */}
        <div
          className="flex items-center gap-2 mb-6 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <button className="text-blue-500">
            <IoArrowBack size={24} />
          </button>
          <h2 className="text-xl font-semibold">Search</h2>
        </div>

        {/* Search input */}
        <div className="w-full flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm mb-6">
          <FiSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none px-3 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Loading state */}
        {loading && <p className="text-sm text-gray-500">Searching...</p>}

        {/* Results */}
        <div className="space-y-4">
          {searchData?.length > 0 ? (
            searchData.map((user) => (
              <div
                key={user.userName}
                className="flex items-center border border-gray-300 gap-4 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                onClick={() => navigate(`/profile/${user.userName}`)}
              >
                {/* Profile image */}
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                  <img
                    src={user.profileImage?.url || "/default-avatar.png"}
                    alt={user.userName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User info */}
                <div>
                  <div className="text-sm font-semibold">{user.userName}</div>
                  <div className="text-xs text-gray-500">{user.name}</div>
                </div>
              </div>
            ))
          ) : (
            !loading &&
            input.trim() && (
              <p className="text-sm text-gray-500">No users found</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
