const fileElement = document.getElementById("customFile");
const display = document.querySelector(".error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (fileElement.files.length === 0) {
    alert("please choose a file");
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
