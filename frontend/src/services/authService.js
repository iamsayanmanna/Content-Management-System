
const API_BASE_URL =
  "http://localhost/Content-Management-System/backend/api";

export async function loginAuthor(identifier, password) {
  const response = await fetch(`${API_BASE_URL}/login.php`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Login failed.");
  }

  return data;
}

export async function checkAuth() {
  const response = await fetch(`${API_BASE_URL}/auth.php`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    return null;
  }

  return data.author;
}

export async function logoutAuthor() {
  const response = await fetch(`${API_BASE_URL}/logout.php`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Logout failed.");
  }

  return data;
}





export async function registerAuthor(username, email, password) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/register.php`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
  } catch {
    throw new Error(
      "Cannot connect to the server. Please try again."
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
    throw new Error(data.message || "Registration failed.");
  }

  return data;
}

export async function updateAuthorProfile(username, email) {
  const response = await fetch(
    `${API_BASE_URL}/update-profile.php`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to update profile.");
  }

  return data;
}


export async function changeAuthorPassword(currentPassword, newPassword) {
  const response = await fetch(
    `${API_BASE_URL}/change-password.php`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to change password.");
  }

  return data;
}
