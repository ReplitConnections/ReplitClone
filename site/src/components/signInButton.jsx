import '../assets/css/global.css';

export default function SignInButton({ signInWebsite, service, callbackURL }) {
    const url = `https://auth.coding398.dev/go/${service}?callback=${encodeURIComponent(callbackURL)}`;

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="signInButton">
            Sign In With {signInWebsite}
        </a>
    );
}
