// app/login/page.tsx
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export default function LoginPage() {
    const router = useRouter();
    const sp = useSearchParams();
    const callbackUrl = sp.get("callbackUrl") || "/dashboard";
    const [form, setForm] = useState({ username: "demo", password: "1234" });
    const [error, setError] = useState("");
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        const res = await signIn("credentials", {
            redirect: false,
            username: form.username,
            password: form.password,
            callbackUrl,
        });
        if (!res?.ok) {
            setError("Invalid username/password");
            return;
        }
        router.push(callbackUrl);
    }
    return (
        <section className="container">
            <h1>Login</h1>
            <form className="card" onSubmit={onSubmit}>
                <label>Username</label>
                <input value={form.username} onChange={(e) => setForm({
                    ...form,
                    username: e.target.value
                })} />
                <label>Password</label>
                <input type="password" value={form.password} onChange={(e) =>
                    setForm({ ...form, password: e.target.value })} />
                {error && <p className="error">{error}</p>}
                <button className="btn" type="submit">Sign in</button>
            </form>
            <p className="muted">
                Demo user: <b>demo</b> / <b>1234</b> (role: user)<br />
                Admin: <b>admin</b> / <b>admin123</b> (role: admin)
            </p>
        </section>
    );
}