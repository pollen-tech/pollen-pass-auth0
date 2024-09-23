export const useAuth = () => {
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

  const cleanup_user_data = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_signup");
      localStorage.removeItem("access_token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("id_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("email");
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
      return localStorage.getItem("expires_at");
    }
    return null;
  };

  const get_access_token = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  const get_id_token = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("id_token");
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

  const clear_localStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  };

  return {
    get_user_id,
    handleAuth0Response,
    is_user_authenticated,
    is_token_expired,
    get_channel,
    get_expire_at,
    get_access_token,
    clear_localStorage,
    cleanup_user_data,
    get_id_token,
  };
};
