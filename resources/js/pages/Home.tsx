interface Props {
    user: string;
}

export default function Home({ user }: Props) {
    return (
        <div className="p-8 bg-white min-h-screen">
            <h1 className="text-2xl font-bold">Halo, {user}!</h1>
            <p>Selamat datang di proyek clean-look kamu.</p>
        </div>
    );
}
