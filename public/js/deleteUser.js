import axios from "axios";

export const deleteUser = async (userId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `http://127.0.0.1:8000/api/v1/users/${userId}`,
    });
    console.log("User deleted successfully");
    setTimeout(() => {
      window.location.reload(); // Reload the page after 2 seconds
    }, 2000);
  } catch (err) {
    alert("Error deleting user");
  }
};
