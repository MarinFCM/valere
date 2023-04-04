const form = document.querySelector("form");
const fileElement = document.getElementById("customFile");
const display = document.querySelector(".error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  display.textContent = "Sending";

  if (fileElement.files.length === 0) {
    display.textContent = "Please choose a file" ;
    return;
  }

  let file = fileElement.files[0];
  let formData = new FormData();
  formData.set("file", file);
  try {
    const res = await fetch("/api/file/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.status === 400 || res.status === 401) {
      return (display.textContent = `${data.message}. ${
        data.error ? data.error : ""
      }`);
    }
    display.textContent = `${data.message}. ${data.error ? data.error : ""}`;
  } catch (err) {
    console.log(err.message);
  }
});

async function logout() {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "GET",
    });
    if (res.status === 200) {
      location.assign("./");
    }
  } catch (err) {
    console.log(err.message);
  }
}
