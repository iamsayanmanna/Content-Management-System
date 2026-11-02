
const API_BASE_URL =
  "http://localhost/Content-Management-System/backend/api";

export async function registerAuthor(username, email, password) {
  const response = await fetch(`${API_BASE_URL}/register.php`, {
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

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Registration failed.");
  }

  return data;
}
