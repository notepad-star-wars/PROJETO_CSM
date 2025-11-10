import {
    auth,
    db,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    setDoc,
    doc,
} from "./firebase.js";

(function () {
    "use strict";

  // Inicializar EmailJS (global)
emailjs.init({
    publicKey: "j9QW1VRGFGJzFaWB7",
});

  // -------------------------
  // FUNÇÕES DE MODAL
  // -------------------------
function openModal(type) {
    const modal = document.getElementById("loginModal");
    modal.classList.remove("hidden");

    if (type === "register") showRegisterForm();
    else showLoginForm();
}

function closeModal() {
    document.getElementById("loginModal").classList.add("hidden");
}

function showLoginForm() {
    document.getElementById("loginFormElement").classList.remove("hidden");
    document.getElementById("registerFormElement").classList.add("hidden");
}

function showRegisterForm() {
    document.getElementById("loginFormElement").classList.add("hidden");
    document.getElementById("registerFormElement").classList.remove("hidden");
}

  // -------------------------
  // AUTENTICAÇÃO COM FIREBASE
  // -------------------------
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Bem-vindo de volta, Jedi!");
        closeModal();
        window.location.href = "lista.html";
    } catch (error) {
        alert("Erro ao logar: " + error.message);
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;

    try {
      // Cria o usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;

      // Salva dados adicionais no Firestore
    await setDoc(doc(db, "users", user.uid), {
        nome: name,
        email: email,
        criadoEm: new Date(),
    });

      // Envia e-mail de boas-vindas via EmailJS
    await emailjs.send("service_hnrkn5a", "template_rp5dbje", {
        name,
        email,
        user_email: email, 
    });

        alert("Cadastro concluído com sucesso, jovem Padawan!");
        closeModal();
        showLoginForm();
    } catch (error) {
        console.error("Erro detalhado:", error);

        const mensagemErro = error.message || error.text || "Erro desconhecido";

        alert("Erro ao cadastrar: " + mensagemErro);
    }
  }

  // -------------------------
  // EVENTOS DE INTERFACE
  // -------------------------
  document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    const btnCadastro = document.getElementById("btnCadastro");
    const closeModalBtn = document.getElementById("close-modal-register");
    const loginForm = document.getElementById("loginFormElement");
    const registerForm = document.getElementById("registerFormElement");
    const linkToRegister = document.getElementById("linkToRegister");
    const linkToLogin = document.getElementById("linkToLogin");

    if (btnLogin) btnLogin.addEventListener("click", () => openModal("login"));
    if (btnCadastro)
      btnCadastro.addEventListener("click", () => openModal("register"));
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (loginForm) loginForm.addEventListener("submit", handleLogin);
    if (registerForm) registerForm.addEventListener("submit", handleRegister);
    if (linkToRegister)
      linkToRegister.addEventListener("click", (e) => {
        e.preventDefault();
        showRegisterForm();
      });
    if (linkToLogin)
      linkToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        showLoginForm();
      });

    console.log("Star Wars To-Do List inicializado!");
  });
})();
