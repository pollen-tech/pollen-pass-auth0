export const api = async (
  url: string,
  method = "GET",
  data: Record<string, any> = {}
): Promise<any> => {
  const config = useRuntimeConfig();
  const accessToken = getAccessToken();

  const init: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "x-internal-key": config.public.internalKey,
    },
    method,
  };

  if (Object.keys(data).length > 0) {
    init.body = JSON.stringify(data);
  }
  try {
    const fetchData = await fetch(url, init);

    if (fetchData.status !== 204) {
      return await fetchData.json();
    }
  } catch (error) {
    console.log(error);
  }
};

export const ppApi = async (
  url: string,
  method = "GET",
  data: Record<string, any> = {}
): Promise<any> => {
  const config = useRuntimeConfig(); // Assuming useRuntimeConfig is imported and available
  const init: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "x-internal-key": config.public.internalKey,
    },
    method,
  };

  if (Object.keys(data).length > 0) {
    init.body = JSON.stringify(data);
  }

  try {
    const fetchData = await fetch(
      new URL(url, config.public.adminApiUrl),
      init
    );

    if (fetchData.status !== 204) {
      return await fetchData.json();
    }
  } catch (error) {
    console.log(error);
  }
};

export const auth0 = async (
  url: string,
  method = "GET",
  data: Record<string, any> = {}
): Promise<any> => {
  const config = useRuntimeConfig(); // Assuming useRuntimeConfig is imported and available
  const init: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    method,
  };

  if (Object.keys(data).length > 0) {
    init.body = JSON.stringify(data);
  }

  try {
    const fetchData = await fetch(
      new URL(url, config.public.adminApiUrl),
      init
    );

    if (fetchData.status !== 204) {
      return await fetchData.json();
    }
  } catch (error) {
    console.log(error);
  }
};