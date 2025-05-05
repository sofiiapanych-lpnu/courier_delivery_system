import React, { createContext, useContext, useState } from "react";

const UserProfileContext = createContext();

export const useUserProfile = () => useContext(UserProfileContext);

export const UserProfileProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isCourier, setIsCourier] = useState(false);

  return (
    <UserProfileContext.Provider value={{ userInfo, setUserInfo, isCourier, setIsCourier }}>
      {children}
    </UserProfileContext.Provider>
  );
};
