// LiftUp Authentication System - (Client-side Auth)
// Stores encrypted user details in localStorage
// Works across all pages + protects restricted sections

// SHA-256 hashing function for secure password storage
async function hash(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

window.LiftUpAuth = {
    async signup(name, email, password, secQ, secA) {
        if (localStorage.getItem(`user_${email}`)) {
            return { success: false, message: "User already exists!" };
        }

        const hashedPass = await hash(password);
        const hashedAns = await hash(secA);

        const userData = {
            name,
            email,
            password: hashedPass,
            securityQuestion: secQ,
            securityAnswer: hashedAns
        };

        localStorage.setItem(`user_${email}`, JSON.stringify(userData));
        return { success: true, message: "Signup successful!" };
    },

    async login(email, password) {
        const user = localStorage.getItem(`user_${email}`);
        if (!user) return { success: false, message: "User not found!" };

        const userData = JSON.parse(user);
        const hashedPass = await hash(password);

        if (hashedPass !== userData.password) {
            return { success: false, message: "Incorrect password!" };
        }

        localStorage.setItem("LiftUp_loggedUser", email);
        return { success: true, message: "Login successful!", user: userData };
    },

    logout() {
        localStorage.removeItem("LiftUp_loggedUser");
        window.location.href = "login.html";
    },

    getCurrentUser() {
        const email = localStorage.getItem("LiftUp_loggedUser");
        if (!email) return null;

        const user = localStorage.getItem(`user_${email}`);
        return user ? JSON.parse(user) : null;
    },

    async resetPassword(email, answer, newPass) {
        const user = localStorage.getItem(`user_${email}`);
        if (!user) return { success: false, message: "No such user" };

        const userData = JSON.parse(user);
        const hashedAns = await hash(answer);

        if (hashedAns !== userData.securityAnswer) {
            return { success: false, message: "Incorrect security answer" };
        }

        userData.password = await hash(newPass);
        localStorage.setItem(`user_${email}`, JSON.stringify(userData));

        return { success: true, message: "Password reset successful" };
    },

    protectPage(redirect = "login.html") {
        const user = this.getCurrentUser();
        if (!user) {
            window.location.href = redirect;
            return false;
        }
        return true;
    },

    renderAuthNav(elementId) {
        const user = this.getCurrentUser();
        const el = document.getElementById(elementId);
        if (!el) return;

        if (user) {
            el.innerHTML = `
                <span style="margin-right:12px;">👋 Hello, <b>${user.name}</b></span>
                <button onclick="LiftUpAuth.logout()" 
                    style="padding:6px 12px; background:#ff5757; color:white; border:none; border-radius:6px; cursor:pointer;">
                    Logout
                </button>
            `;
        }
    }
};
