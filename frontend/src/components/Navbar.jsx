import React from 'react';
import {
  MdHomeFilled,
  MdSearch,
  MdVideoLibrary,
  MdAddBox,
  MdPerson,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const navItems = [
    {
      label: 'Home',
      icon: <MdHomeFilled size={24} />,
      onClick: () => navigate('/'),
    },
    {
      label: 'Search',
      icon: <MdSearch size={24} />,
      onClick: () => navigate('/search'), // TODO: Hook up later
    },
    {
      label: 'Loops',
      icon: <MdVideoLibrary size={24} />,
      onClick: () => {navigate('/loops')}, // TODO: Hook up later
    },
    {
      label: 'Create',
      icon: <MdAddBox size={24} />,
      onClick: () => navigate('/upload'),
    },
    {
      label: 'Profile',
      icon: userData?.user?.profileImage?.url ? (
        <img
          src={userData.user.profileImage.url}
          alt="Profile"
          className="w-6 h-6 rounded-full object-cover border"
        />
      ) : (
        <MdPerson size={24} />
      ),
      onClick: () => {
        if (userData?.user?.userName) {
          navigate(`/profile/${userData.user.userName}`);
        }
      },
    },
  ];

  return (
    <div className="flex justify-between items-center bg-white border px-4 py-2 rounded-full shadow-md w-full max-w-md mx-auto">
      {navItems.map((item, idx) => (
        <NavItem key={idx} icon={item.icon} onClick={item.onClick} />
      ))}
    </div>
  );
};

const NavItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center text-gray-600 hover:text-black transition duration-200"
    title={label}
  >
    <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
    <span className="text-[10px] mt-1/2 text-black hidden sm:block">{label}</span>
  </button>
);

export default Navbar;
