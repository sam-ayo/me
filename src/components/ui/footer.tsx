const Footer = ({className}: {className?: string}) => {
    return(
        <footer
        className={`${className} flex justify-between`}>
        <div>
            Copyright &#169; {new Date().getFullYear()} Samuel Adeoye
        </div>
        <div>
        <a href="https://github.com/sam-ayo/me" className="hover:underline">Source</a>
        </div>
        </footer>
    )
}

export {Footer}