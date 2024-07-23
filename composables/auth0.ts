export const useAuth = () => {
  const runtimeConfig = useRuntimeConfig();

  const handleAuth0Response = (response: {
    access_token: string;
    id_token: string;
    user_id: string;
    expires_in: number;
  }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("id_token", response.id_token);
      localStorage.setItem("user_id", response?.user_id);
      localStorage.setItem(
        "expires_at",
        JSON.stringify(response.expires_in * 1000 + new Date().getTime())
      );
    }
  };

  const get_user_id = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_id");
    }
    return null;
  };

  const get_expire_at = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_id");
    }
    return null;
  };

  const get_access_token = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_id");
    }
    return null;
  };

  const is_token_expired = () => {
    if (typeof window !== "undefined") {
      const expiresAt = localStorage.getItem("expires_at");
      if (!expiresAt) {
        return true;
      }
      return new Date().getTime() > JSON.parse(expiresAt);
    }
    return true;
  };

  const is_user_authenticated = () => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      return accessToken !== null && !is_token_expired();
    }
    return false;
  };

  const get_channel = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("channel");
    }
    return null;
  };

  return {
    get_user_id,
    handleAuth0Response,
    is_user_authenticated,
    is_token_expired,
    get_channel,
    get_expire_at,
    get_access_token,
  };
};
