import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { buttonVariants } from '../ui/button';
import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons'

interface SignInButtonProps {
    provider: 'google' | 'github';
    callbackURL: string;
}

export default function SignInButton({ provider, callbackURL }: SignInButtonProps) {
    const url = `https://auth.coding398.dev/go/${provider}?callback=${encodeURIComponent(callbackURL)}`;

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
            {
                provider === "github" && (
                    <SiGithub className='size-4' />
                )
            }
            {
                provider === "google" && (
                    <SiGoogle className='size-4' />
                )
            } Sign In With {provider}
        </a>
    );
}