import React, { ReactNode, useState } from 'react';

const UserContext = React.createContext<TContextUser>({
  isAuthorizedUser: false,
  setIsAuthorizedUser: () => false,
  avatar: '',
  setAvatar: () => '',
  cover: '',
  setCover: () => '',
  slug: '',
  setSlug: () => '',
});

type UserProviderPropTypes = {
  children: ReactNode;
  isAuthorized?: boolean;
  user: TUser;
}

export function UserProvider({ children, isAuthorized, user }: UserProviderPropTypes) {
  const [isAuthorizedUser, setIsAuthorizedUser] = useState<boolean>(isAuthorized ?? false);
  const [avatar, setAvatar] = useState<string>(user ? (user.image ? user.image : user.defaultImage) : '');
  const [cover, setCover] = useState<string>(user && user.cover ? user.cover : '');
  const [slug, setSlug] = useState<string>(user && user.slug ? user.slug : '');

  return (
    <UserContext.Provider
      value={{ isAuthorizedUser, setIsAuthorizedUser, avatar, setAvatar, cover, setCover, slug, setSlug }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
