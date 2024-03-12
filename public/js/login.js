/* exlint-disable */
import axios from "axios";

export const login = async (email, password) => {
  console.log(email, password);

  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/login",
      data: {
        email: email,
        password: password,
      },
    });
    if (res.data.status === "success") {
      console.log("Logged in successfully");
      window.setTimeout(() => {
        location.assign("/feed");
      }, 1500);
    }

    console.log(res);
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:8000/api/v1/users/logout",
    });

    if (res.data.status === "success") {
      // Use === for comparison
      window.location.href = "/";
    }

    console.log(res);
  } catch (err) {
    alert("Error logging out");
  }
};
export const forgetPassword = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/forgotPassword",
      data: {
        email: email,
      },
    });
    if (res.data.status === "success") {
      console.log("Logged in successfully");
      // window.setTimeout(() => {
      //   location.assign("/feed");
      // }, 1500);
    }

    console.log(res);
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const resetPassword = async (password, passwordConfirm, token) => {
  console.log("Password:", password);
  console.log("Password Confirm:", passwordConfirm);

  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:8000/api/v1/users/resetPassword/${token}`,
      data: {
        password: password,
        passwordConfirm: passwordConfirm,
      },
    });
    console.log(res); // Debugging statement

    // Handle success response if needed
    if (res.data.status === "success") {
      console.log("Password reset successfully");
      window.setTimeout(() => {
        location.assign("/feed");
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
    // Handle error if needed
  }
};
