"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React, { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { signIn } from 'next-auth/react'

const Signup = () => {

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [pending, setPending] = useState(false);
    const [error, setError] = useState(null);

    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPending(true);
        const url = "http://localhost:3000/api/auth/sign-up";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form),
        });
        const data = await response.json();
        if (response.ok) {
            setPending(false);
            setError(null)
            toast({
                title: "Authentication",
                description: data.message,
            });
            router.push('/sign-in');
        } else if (response.status === 400) {
            setPending(false);
            setError(data.message);
        } else if (response.status === 500) {
            setPending(false);
            setError(data.message);
        }
    }
    const handleProvider = async (e, provider) => {
        e.preventDefault();
        await signIn(provider, { callbackUrl: '/' });
    }

    return (
        <div className='h-full flex items-center justify-center bg-black'>
            <Card className="md:h-auto w-[30%] p-4">
                {!!error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <CardHeader>
                    <CardTitle className='text-center text-2xl'>Sign Up</CardTitle>
                    <CardDescription className='text-center'>Sign up to Create new account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <Input
                            type="username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            name="username"
                            placeholder="User Name"
                            disabled={pending}
                            required
                        />
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            name="email"
                            placeholder="Email Id"
                            disabled={pending}
                            required
                        />
                        <Input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            name="password"
                            placeholder="Password"
                            disabled={pending}
                            required
                        />
                        <Button
                            className="w-full"
                            disabled={pending}
                            onClick={handleSubmit}
                        >
                            Sign Up
                        </Button>
                        <Separator />
                    </form>
                    <CardDescription className='text-center my-2'>SignUp with</CardDescription>
                    <div className='flex justify-evenly items-center'>
                        <Button ><FaGoogle />Google</Button>
                        <Button onClick={(e) => handleProvider(e, "github")}><FaGithub />Github</Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <CardDescription>
                        Aleary Have Account! <Link href='sign-in' className='text-blue-700'>Sign In here.</Link>
                    </CardDescription>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Signup 
