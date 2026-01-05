import qs from "qs";
// import { cacheLife } from "next/cache";
export const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || "http://localhost:1337";

export const getStrapiURL = (path: string) => {
  return `${STRAPI_BASE_URL}${path}`;
};

const QUERY_HOME_PAGE = {
  populate: {
    sections: {
      on: {
        "layout.hero-section": {
          populate: {
            image: { fields: ["url", "alternativeText"] },
            link: {
              populate: true
            }
          }
        }
      }
    }
  }
};

export async function fetchHomePage() {
  'use cache';

  // cacheLife({ expire: 60 }); // cache for 60 seconds

  const queryString = qs.stringify(QUERY_HOME_PAGE);

  const response = await fetchAPI(`/api/home-page?${queryString}`);
  return response?.data;
}

export const fetchAPI = async (path: string, options: RequestInit = {}) => {
  const requestUrl = getStrapiURL(path);
  const response = await fetch(requestUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`An error occurred while fetching data: ${response.statusText}`);
  }

  return response.json();
};

export async function registerUserService(userData: { username: string; email: string; password: string }) {
  try {
    const response = await fetch(getStrapiURL("/api/auth/local/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("Parsed response data:", data);

    return data;
  } catch (error) {
    console.error("Error registering user:", error);

    throw error;
  }
}

export async function loginUserService(userData: { username: string; email: string; password: string }) {
  try {
    const response = await fetch(getStrapiURL("/api/auth/local"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("Parsed response data:", data);

    return data;
  } catch (error) {
    console.error("Error login user:", error);

    throw error;
  }
} 