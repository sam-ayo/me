const Footer = ({className}: {className?: string}) => {
    return(
        <footer
        className={`${className} flex justify-between text-xs`}>
        <div>
            Copyright &#169; {new Date().getFullYear()} Samuel Adeoye
        </div>
        <div>
        <a target="_blank" href="https://github.com/sam-ayo/me" className="hover:underline">Source</a>
        </div>
        </footer>
    )
}

export {Footer}