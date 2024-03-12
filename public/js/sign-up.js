import axios from "axios";

export const signUp = async (name, email, password, passwordConfirm) => {
  console.log(email, password);

  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      console.log("Signed in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }

    console.log(res);
  } catch (err) {
    alert(err.response.data.message);
  }
};
