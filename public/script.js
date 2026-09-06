/* =========================================================
   Signup Form Validation & Redirect
   ========================================================= */
function initSignupForm() {
  const form = document.getElementById("signupForm");
  const note = document.getElementById("formNote");

  if (!form || window.__urbanThreadsSignupInit) return;
  window.__urbanThreadsSignupInit = true;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const termsInput = document.getElementById("terms");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    const terms = termsInput ? termsInput.checked : false;

    if (!name || !email || !password) {
      if (note) note.textContent = "Please complete all fields.";
      return;
    }

    if (password.length < 6) {
      if (note) note.textContent = "Password must be at least 6 characters.";
      return;
    }

    if (!terms) {
      if (note) note.textContent = "Please accept the signup checkbox.";
      return;
    }

    try {
      sessionStorage.setItem("urbanThreadsSignedUp", "true");
      sessionStorage.setItem("urbanThreadsName", name);
      sessionStorage.setItem("skylineSignedUp", "true");
      sessionStorage.setItem("skylineName", name);
    } catch (e) {
      // Ignore sessionStorage exceptions (e.g. private mode or file protocol restrictions)
    }

    if (note) note.textContent = "Account created. Opening the collection...";
    window.location.href = "shop.html?signedUp=true&name=" + encodeURIComponent(name);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSignupForm);
} else {
  initSignupForm();
}


/* =========================================================
   Banner Ad Click Handling -> Direct access to shop
   ========================================================= */
function initBannerAd() {
  if (window.__urbanThreadsBannerInit) return;
  window.__urbanThreadsBannerInit = true;

  const bannerLinks = document.querySelectorAll(
    "#bannerAdPhotoLink, #bannerAdCta, .banner-ad-card-link, .banner-ad-cta-btn"
  );
  bannerLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      sessionStorage.setItem("urbanThreadsSignedUp", "true");
      sessionStorage.setItem("skylineSignedUp", "true");
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBannerAd);
} else {
  initBannerAd();
}

/* =========================================================
   Show / Hide Password Toggle
   ========================================================= */
function initPasswordToggle() {
  if (window.__urbanThreadsToggleInit) return;

  const toggleBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  if (!toggleBtn || !passwordInput) return;
  window.__urbanThreadsToggleInit = true;

  toggleBtn.addEventListener("click", function () {
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");

    toggleBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    toggleBtn.setAttribute("aria-pressed", isPassword ? "true" : "false");
    toggleBtn.setAttribute("title", isPassword ? "Hide password" : "Show password");

    const textSpan = toggleBtn.querySelector(".toggle-password-text");
    if (textSpan) {
      textSpan.textContent = isPassword ? "HIDE" : "SHOW";
    }

    const showIcon = toggleBtn.querySelector(".eye-icon-show");
    const hideIcon = toggleBtn.querySelector(".eye-icon-hide");
    if (showIcon && hideIcon) {
      showIcon.style.display = isPassword ? "none" : "block";
      hideIcon.style.display = isPassword ? "block" : "none";
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPasswordToggle);
} else {
  initPasswordToggle();
}

/* =========================================================
   Typing Effect for "Wear the sky." Hero Title
   ========================================================= */
function initTypewriter() {
  if (window.__urbanThreadsTypewriterInit) return;

  const line1El = document.querySelector(".type-line-1 .type-text");
  const line2El = document.querySelector(".type-line-2 .type-text");
  const line1Container = document.querySelector(".type-line-1");
  const line2Container = document.querySelector(".type-line-2");
  const heroH1 = document.querySelector(".hero-title");

  if (!line1El || !line2El || !line1Container || !line2Container) return;
  window.__urbanThreadsTypewriterInit = true;

  const text1 = line1El.getAttribute("data-text") || "Wear the";
  const text2 = line2El.getAttribute("data-text") || "sky.";

  // Respect user motion preferences
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    line1El.textContent = text1;
    line2El.textContent = text2;
    return;
  }

  // Create blinking cursor
  const cursor = document.createElement("span");
  cursor.className = "typing-cursor";
  cursor.setAttribute("aria-hidden", "true");

  // Initial state: empty lines, cursor at start of line 1
  line1El.textContent = "";
  line2El.textContent = "";
  line1Container.appendChild(cursor);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let isHovered = false;
  if (heroH1) {
    heroH1.addEventListener("mouseenter", () => { isHovered = true; });
    heroH1.addEventListener("mouseleave", () => { isHovered = false; });
  }

  const waitWhileHovered = async () => {
    while (isHovered) {
      await sleep(100);
    }
  };

  async function typeLoop() {
    // Initial delay before typing starts so user sees the scene settle
    await sleep(500);

    while (true) {
      // 1. Type Line 1 ("Wear the")
      cursor.classList.add("typing");
      line1Container.appendChild(cursor);

      for (let i = 1; i <= text1.length; i++) {
        await waitWhileHovered();
        line1El.textContent = text1.slice(0, i);
        await sleep(75 + Math.random() * 45);
      }

      // Brief natural pause between line 1 and line 2
      cursor.classList.remove("typing");
      await sleep(260);

      // 2. Type Line 2 ("sky.")
      cursor.classList.add("typing");
      line2Container.appendChild(cursor);

      for (let i = 1; i <= text2.length; i++) {
        await waitWhileHovered();
        line2El.textContent = text2.slice(0, i);
        await sleep(85 + Math.random() * 45);
      }

      // 3. Full text typed: hold for readability and let cursor blink
      cursor.classList.remove("typing");

      // Pause for ~3.5 seconds while allowing hover to hold indefinitely
      for (let waited = 0; waited < 3500; waited += 100) {
        await sleep(100);
        await waitWhileHovered();
      }

      // 4. Backspace Line 2
      cursor.classList.add("typing");
      for (let i = text2.length - 1; i >= 0; i--) {
        await waitWhileHovered();
        line2El.textContent = text2.slice(0, i);
        await sleep(40);
      }

      // Move cursor back to Line 1
      line1Container.appendChild(cursor);
      await sleep(120);

      // 5. Backspace Line 1
      for (let i = text1.length - 1; i >= 0; i--) {
        await waitWhileHovered();
        line1El.textContent = text1.slice(0, i);
        await sleep(35);
      }

      // Pause before restarting typing loop
      cursor.classList.remove("typing");
      await sleep(750);
    }
  }

  typeLoop();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTypewriter);
} else {
  initTypewriter();
}


