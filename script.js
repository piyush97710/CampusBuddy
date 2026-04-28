import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBo0V0nGLMt9ocSpbA56FOAMsIYhWNzW98",
  authDomain: "campusbuddy-29b87.firebaseapp.com",
  projectId: "campusbuddy-29b87",
  storageBucket: "campusbuddy-29b87.firebasestorage.app",
  messagingSenderId: "1056639554896",
  appId: "1:1056639554896:web:618270eaa507ced6acc855"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentTab = "pg";

// 🔄 SWITCH TAB
window.switchTab = function(tab) {
  currentTab = tab;
  loadData();
};

// ➕ ADD DATA (MATCHING YOUR FIRESTORE STRUCTURE)
window.addData = async function () {

  const title = document.getElementById("title").value;
  const ownerCompany = document.getElementById("ownerCompany").value;
  const college = document.getElementById("college").value;
  const location = document.getElementById("location").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  const collectionName = currentTab === "pg" ? "pg_listings" : "job_listings";

  await addDoc(collection(db, collectionName), {

    title: title,

    // 🔥 IMPORTANT: store exactly like Firestore
    "Owner Company": ownerCompany,
    "College": college,
    "Location": location,
    "price": price,
    "Price": price,
    "Description": description

  });

  alert("Posted 🚀");
  loadData();
};

// 📥 LOAD DATA
window.loadData = async function () {

  const list = document.getElementById("list");
  list.innerHTML = "";

  const collectionName = currentTab === "pg" ? "pg_listings" : "job_listings";

  const snapshot = await getDocs(collection(db, collectionName));

  snapshot.forEach(doc => {
    const d = doc.data();

    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <h3>${d.title || "No Title"}</h3>
      <p><b>Owner:</b> ${d["Owner Company"] || ""}</p>
      <p><b>College:</b> ${d["College"] || ""}</p>
      <p><b>Location:</b> ${d["Location"] || ""}</p>
      <p><b>Price:</b> ${d.price || d.Price || ""}</p>
      <p>${d["Description"] || ""}</p>
    `;

    list.appendChild(div);
  });
};

// 🔍 SEARCH
window.searchData = async function () {

  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const list = document.getElementById("list");

  list.innerHTML = "";

  const collectionName = currentTab === "pg" ? "pg_listings" : "job_listings";

  const snapshot = await getDocs(collection(db, collectionName));

  snapshot.forEach(doc => {
    const d = doc.data();

    const college = (d["College"] || "").toLowerCase();
    const location = (d["Location"] || "").toLowerCase();

    if (college.includes(keyword) || location.includes(keyword)) {

      const div = document.createElement("div");
      div.classList.add("card");

      div.innerHTML = `
        <h3>${d.title}</h3>
        <p>${d["Owner Company"] || ""}</p>
        <p>${d["College"] || ""}</p>
        <p>${d["Location"] || ""}</p>
        <p>${d.price || d.Price || ""}</p>
        <p>${d["Description"] || ""}</p>
      `;

      list.appendChild(div);
    }
  });
};

// INIT
loadData();