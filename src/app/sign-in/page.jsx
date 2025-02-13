"use client"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { signIn } from "next-auth/react"
import { FaGithub, FaGoogle } from 'react-icons/fa'

const Signin = () => {

    const router = useRouter();
    const { toast } = useToast();
    const [error, setError] = useState(null);
    const [pending, setPending] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPending(true);
        const response = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });
        if (response.ok) {
            setPending(false);
            setError(null);
            toast({
                title: "Authentication",
                description: "Login Successfull."
            });
            router.push('/');
        } else if (response.status === 401) {
            setError("Invailid Credential.");
            setPending(false);
        } else {
            setError("Something went wrong.");
            setPending(false);
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
                        <AlertCircle className='h-4 w-4'></AlertCircle>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <CardHeader>
                    <CardTitle className='text-center text-2xl'>Sign In</CardTitle>
                    <CardDescription className='text-center'>Sign in using your username and password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            placeholder="Email"
                            disabled={pending}
                            required
                        />
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            placeholder="Password"
                            disabled={pending}
                            required
                        />
                        <Button
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={pending}
                        >
                            Sign In
                        </Button>
                        <Separator />
                    </form>
                    <CardDescription className='text-center my-2'>SignIn with</CardDescription>
                    <div className='flex justify-evenly items-center'>
                        <Button ><FaGoogle />Google</Button>
                        <Button onClick={(e) => handleProvider(e, "github")}><FaGithub />Github</Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <CardDescription>
                        Create New Account. <Link href='sign-up' className='text-blue-700'>Sign Up here.</Link>
                    </CardDescription>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Signin
