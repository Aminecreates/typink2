/* eslint-disable */
console.log("Script loaded");

import "@babel/polyfill";
import $ from "jquery";

import { login, logout, forgetPassword, resetPassword } from "./login";
import {
  updateData,
  updatePassword,
  updateProfessionDescription,
  updateUserPhoto,
  createArticleForm,
} from "./updateSettings";
import FroalaEditor from "froala-editor";
import { deleteUser } from "./deleteUser";
import { deleteArticle } from "./deleteArticle";
import { signUp } from "./sign-up";

// Values;
var editor = new FroalaEditor("#example", {
  heightMin: 300,
});

const uploadUserPhotoForm = document.querySelector(".user-info-img-side");
const signOut = document.querySelector(".signout-btn");
const userDataForm = document.querySelector(".user-info-form");

const loginForm = document.querySelector(".form--login");
const signUpForm = document.querySelector(".form--signup");
const forgetPasswordForm = document.querySelector(".form--forgetPassword");

////
///
///
///
//

const editMyInformations = document.querySelector(".user-info-container");

if (editMyInformations) {
  editMyInformations.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submitted!");

    const formData = new FormData(editMyInformations);

    try {
      // Update user data
      await updateData(formData.get("name"), formData.get("email"));

      // Update user photo
      const photoFile = document.getElementById("article-photo").files[0];
      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append("photo", photoFile);
        await updateUserPhoto(photoFormData);
        console.log("Photo updated successfully");
      }

      // Update profession and description
      const profession = formData.get("profession");
      const description = formData.get("description");
      await updateProfessionDescription(profession, description);
      console.log("Profession and description updated successfully");

      // Update password
      const passwordCurrent = formData.get("password-current");
      const password = formData.get("password");
      const passwordConfirm = formData.get("password-confirm");
      await updatePassword(passwordCurrent, password, passwordConfirm);
      console.log("Password updated successfully");
    } catch (error) {
      console.error("Error updating user information:", error);
      // Handle the error, display a message, or perform other actions
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
if (forgetPasswordForm) {
  forgetPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("clicked ");
    const email = document.getElementById("email").value;
    forgetPassword(email);
  });
}

if (signUpForm) {
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    signUp(name, email, password, passwordConfirm);
  });
}

if (signOut) signOut.addEventListener("click", logout);

const articleForm = document.getElementById("article-form");

if (articleForm) {
  articleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the values from form fields
    const title = document.getElementById("article-title").value;
    const topic = document.getElementById("article-topic").value;
    const imageCover = document.getElementById("article-photo").files[0];
    const editorContent = editor.html.get();
    const tags = document.getElementById("tags").value;

    // Create a FormData object and append form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("topic", topic);
    formData.append("imageCover", imageCover);
    formData.append("content", editorContent);
    formData.append("tags", tags);

    // Log the form data for debugging purposes
    console.log("Form Data:", formData);

    try {
      // Submit the form data using Axios
      const response = await createArticleForm(formData, "article");

      // Optionally, you can handle the response here
      console.log("Article submitted successfully:", response);

      // Optionally, reset the form
      articleForm.reset();
    } catch (error) {
      console.error("Error submitting article:", error);
      // Handle the error, display a message, or perform other actions
    }
  });
}

//
//
//
//
//
//
//
//

const dashTab = document.querySelector(".tab");
if (dashTab)
  document.addEventListener("DOMContentLoaded", function () {
    // Get tab buttons
    var usersTabBtn = document.getElementById("usersTabBtn");
    var blogsTabBtn = document.getElementById("blogsTabBtn");

    // Add event listeners to tab buttons
    usersTabBtn.addEventListener("click", function () {
      openTab("Users");
    });
    blogsTabBtn.addEventListener("click", function () {
      openTab("Blogs");
    });
  });

const openTab = (tabName) => {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("active");
};

//
//
//
//
//
//

const table = document.querySelector(".table-container");

if (table) {
  document.querySelectorAll(".delete-user-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const userId = event.target.dataset.userId;
      deleteUser(userId);
    });
  });
  //
  //
  //
  document.querySelectorAll(".delete-article-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const articleId = event.target.dataset.articleId;
      deleteArticle(articleId);
    });
  });
}

//
//
//
//
//
$(document).ready(function () {
  var originalPosition = $(".feed-right-actual-content").offset().top;
  var threshold = 10; // Adjust this value as needed

  $(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    var rightContentTop = $(".feed-right-actual-content").offset().top;

    // Add fixed class if scrolling down or if it's past its original position minus the threshold
    if (
      scrollTop > rightContentTop ||
      scrollTop > originalPosition - threshold
    ) {
      $(".feed-right-actual-content").addClass("fixed");
    } else {
      $(".feed-right-actual-content").removeClass("fixed");
    }
  });
});
//////
/////
////
///
//
//
//
///
document.addEventListener("DOMContentLoaded", async function () {
  const leftContentTabs = document.querySelectorAll(".feed-tab");
  const rightContentTabs = document.querySelectorAll(".topic");

  // Event listener for left content tabs
  leftContentTabs.forEach((tab) => {
    tab.addEventListener("click", async function () {
      const topic = this.getAttribute("data-topic");

      // Remove "active" class from all left content tabs
      leftContentTabs.forEach((t) => {
        t.classList.remove("active");
      });

      // Add "active" class to the clicked left content tab
      this.classList.add("active");

      try {
        let url = `${window.location.origin}/api/v1/blogs`;

        // If topic is not "All", add topic to the URL
        if (topic && topic.toLowerCase() !== "all") {
          url += `?topic=${topic}`;
        }

        // Fetch blogs based on the selected topic or fetch all blogs
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const blogs = await response.json();

        // Clear existing blogs
        const articleCardsContainer = document.querySelector(
          ".feed-article-cards-container"
        );
        articleCardsContainer.innerHTML = "";

        // Render filtered blogs
        blogs.data.blogs.forEach((blog) => {
          const articleCard = document.createElement("div");
          articleCard.classList.add("feed-article-card");
          // Construct the card HTML using blog data
          articleCard.innerHTML = `
            <div class="article-card-top">
              <div class="author-img__username">
                <div class="user-img-container">
                  <img
                    src="${
                      blog.author ? `/imgs/users/${blog.author.photo}` : "#"
                    }"
                    alt=""
                  />
                </div>
                <div class="article-card-author-name-topic">
                  <span class="article-card-author-name">
                    ${blog.author ? blog.author.name : "Anonymous"}
                  </span>
                  <span class="on">on</span>
                  <span class="article-card-topic">${blog.topic}</span>
                </div>
              </div>
              <div class="article-card-date">2 hours ago</div>
            </div>
            <div class="feed-article-card-image-container">
              <img
                src="/imgs/article-images/${blog.imageCover}"
                alt=""
              />
            </div>
            <div class="article-card-title-paragraphe">
              <div class="article-card-title">${blog.title}</div>
              <div class="article-card-paragraphe">
                ${blog.summary}
              </div>
            </div>
          `;
          articleCardsContainer.appendChild(articleCard);
        });
      } catch (error) {
        console.error(error);
      }
    });
  });

  // Event listener for right content tabs
  rightContentTabs.forEach((tab) => {
    tab.addEventListener("click", async function () {
      const topic = this.getAttribute("data-topic");

      // Remove "active" class from all right content tabs
      rightContentTabs.forEach((t) => {
        t.classList.remove("active");
      });

      // Add "active" class to the clicked right content tab
      this.classList.add("active");

      // Trigger a click event on the corresponding left tab
      const correspondingLeftTab = document.querySelector(
        `.feed-tab[data-topic="${topic}"]`
      );
      if (correspondingLeftTab) {
        correspondingLeftTab.click();
      }

      // Fetch blogs based on the selected topic for the right content
      // Add your fetch logic here
    });
  });
});

const resetPasswordForm = document.querySelector(".form--resetPassword");

if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const token = window.location.pathname.split("/").pop(); // Extract token from URL

    console.log("Password:", password);
    console.log("Password Confirm:", passwordConfirm);

    // Call the resetPassword function with the provided password and confirmPassword
    resetPassword(password, passwordConfirm, token);
  });
}
