import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeButton = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="cursor-pointer hover:scale-110 transition-transform text-2xl"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-600" />}
    </button>
  );
};

export default ThemeButton;
