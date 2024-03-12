import axios from "axios";

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMe",
      data: {
        name,
        email,
      },
    });

    if (res.data.status === "success") {
      console.log("success", "Data updates successfully");
    }
  } catch (err) {
    console.log("error");
  }
};

export const updateUserPhoto = async (formData) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMe",
      data: formData,
    });

    if (res.data.status === "success") {
      console.log("Data updated successfully");
    }
  } catch (err) {
    console.error("Error updating data", err);
    throw err; // Re-throw the error to handle it outside if needed
  }
};

export const updatePassword = async (
  passwordCurrent,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMyPassword",
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      console.log("success", "Data updates successfully");
    }
  } catch (err) {
    console.log("error");
  }
};
export const updateProfessionDescription = async (profession, description) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMe",
      data: {
        profession,
        description,
      },
    });

    if (res.data.status === "success") {
      console.log("Profession and description updated successfully");
    }
  } catch (err) {
    console.error("Error updating profession and description", err);
    throw err; // Re-throw the error to handle it outside if needed
  }
};

export const createArticleForm = async (data, type) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/blogs",
      data,
    });

    if (res.data.status === "success") {
      console.log("success", `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.assign("/feed");
      }, 1500);
    }
  } catch (err) {
    console.log("error", err.response.data.message);
  }
};
