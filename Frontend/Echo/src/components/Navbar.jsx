function Navbar(props) {
    return (
        <div>
            <header>    
                <div className="container">
                    <a href="#" className="logo">
                        <img src={logo} alt="AI Attendance Logo" />
                    </a>
                    <nav>
                        <ul>
                            <li><a href="#about">About</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li> <Link to="/login" className="login-btn">Login</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>
    </div>
    )
}
export default Navbar;