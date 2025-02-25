import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/password');  // Automatically redirects to /password
    return null;
}
