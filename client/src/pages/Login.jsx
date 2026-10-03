import React from "react";
import { SignIn } from "@clerk/react";

const appearance = {
    variables: {
        colorPrimary: "#ea580c",
        colorForeground: "#18181b",
        colorInputText: "#18181b",
        colorInputBackground: "#ffffff",
        borderRadius: "0.75rem",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    },
    elements: {
        rootBox: "w-full",
        card: "w-full rounded-2xl border border-zinc-200 shadow-sm",
        headerTitle: "hidden",
        headerSubtitle: "hidden",
        formFieldLabel: "text-zinc-700",
        formFieldInput: "rounded-xl border-zinc-300 focus:border-orange-600 focus:ring-orange-600",
        formButtonPrimary: "rounded-xl bg-orange-600 hover:bg-orange-700",
        socialButtonsBlockButton: "rounded-xl border-zinc-300 hover:bg-zinc-50",
        footerActionLink: "text-orange-600 hover:text-orange-700",
        identityPreviewEditButton: "text-orange-600 hover:text-orange-700",
    },
};

const Login = () => (
    <div className="min-h-screen text-zinc-900 flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 bg-linear-to-br from-orange-50 via-zinc-100 to-red-50 border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col justify-between relative overflow-hidden">
            <div className='absolute inset-0 bg-[url("/pattern.svg")]'></div>
            <div className="relative z-10 flex items-center gap-3"><img src="/logo.svg" alt="Drivea Logo" className="max-h-9" /><span className="text-4xl font-medium uppercase text-zinc-900">Drivea</span></div>
            <div className="relative z-10 my-12 space-y-6"><h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-zinc-900 leading-tight">Secure, Simple &amp; Fast <br /><span className="text-orange-600">Cloud Storage.</span></h1><p className="text-sm md:text-base text-zinc-600 max-w-md leading-relaxed">Store your files securely in our drive, organize into folders, share with permissions and access anywhere.</p></div>
            <div className="relative z-10 text-sm text-zinc-500">© 2026 GreatStack. All rights reserved.</div>
        </div>

        <main className="md:w-1/2 p-8 md:p-12 lg:p-16 flex items-center justify-center bg-white" aria-label="Sign in">
            <div className="w-full max-w-md space-y-6">
                <div><h2 className="text-2xl font-medium text-zinc-900">Welcome back to Drivea</h2><p className="mt-1 text-sm text-zinc-500">Sign in securely to access your Drive.</p></div>
                <SignIn
                    routing="path"
                    path="/login"
                    signUpUrl="/register"
                    fallbackRedirectUrl="/dashboard"
                    appearance={appearance}
                />
            </div>
        </main>
    </div>
);

export default Login;
