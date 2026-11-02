
const API_BASE_URL =
  "http://localhost/Content-Management-System/backend/api";

export async function getPosts() {
  const response = await fetch(`${API_BASE_URL}/posts.php`);

  if (!response.ok) {
    throw new Error("Failed to fetch posts from the server.");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Could not load posts.");
  }

  return data.posts;
}



export async function getMyPosts() {
  let response;

  try {

  

    response = await fetch(`${API_BASE_URL}/posts.php?mine=1`, {
      method: "GET",
      credentials: "include",
    });
  } catch {
    throw new Error(
      "Cannot connect to the server. Please check your connection and try again."
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The server returned an invalid response. Please try again."
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not load your posts.");
  }

  return data.posts;
}






export async function createPost(post) {
  const response = await fetch(`${API_BASE_URL}/posts.php`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to publish post.");
  }

  return data;
}


export async function updatePost(id, post) {
  const response = await fetch(`${API_BASE_URL}/posts.php`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      ...post,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to update post.");
  }

  return data;
}



export async function deletePost(id) {
  const response = await fetch(`${API_BASE_URL}/posts.php`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to delete post.");
  }

  return data;
}


export async function uploadCoverImage(file) {
  const formData = new FormData();
  formData.append("cover_image", file);

  const response = await fetch(
    "http://localhost/Content-Management-System/backend/api/upload-cover.php",
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Cover image upload failed.");
  }

  return data.cover_image;
}
