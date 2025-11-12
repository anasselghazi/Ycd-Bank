
    export const KEY = "ycd_bank";

    const defaultState = () => ({ users: [], activeUserEmail: null });

    function readState() {
        const raw = localStorage.getItem(KEY);

        try {
            const parsed = JSON.parse(raw);

            if (parsed && Array.isArray(parsed.users)) {
                return {
                    users: parsed.users,
                    activeUserEmail: parsed.activeUserEmail ?? null
                };
            }

            if (parsed && parsed.user) {
                return {
                    users: [parsed],
                    activeUserEmail: parsed.session?.isLoggedIn ? parsed.user.email : null
                };
            }

            return defaultState();
        } catch (error) {
            console.log("No Users");
            return defaultState();
        }

    }

    function writeState(state) {
        localStorage.setItem(KEY, JSON.stringify(state));
    }

    export function findUserByEmail(email) {
        if (!email) return null;
        const state = readState();
        return state.users.find((user) => user?.user?.email === email) || null;
    }

    export function setActiveUser(email) {
        const state = readState();

        if (!email) {
            state.activeUserEmail = null;
            writeState(state);
            return null;
        }

        const selected = state.users.find((user) => user?.user?.email === email) || null;

        if (selected) {
            state.activeUserEmail = email;
            writeState(state);
        }

        return selected;
    }

    export function load() {
        const state = readState();

        if (!state.activeUserEmail) return null;

        return state.users.find((user) => user?.user?.email === state.activeUserEmail) || null;
    }

    export function save(user) {
        if (!user?.user?.email) {
            console.warn("Cannot save user without an email");
            return;
        }

        const state = readState();
        const userEmail = user.user.email;
        const index = state.users.findIndex((item) => item?.user?.email === userEmail);

        if (index === -1) {
            state.users.push(user);
        } else {
            state.users[index] = user;
        }

        state.activeUserEmail = userEmail;
        writeState(state);
    }
