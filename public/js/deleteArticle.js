import axios from "axios";

export const deleteArticle = async (articleId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `http://127.0.0.1:8000/api/v1/blogs/${articleId}`,
    });
    console.log("Article deleted successfully");
    setTimeout(() => {
      window.location.reload(); // Reload the page after 2 seconds
    }, 2000);
  } catch (err) {
    alert("Error deleting Article");
  }
};
