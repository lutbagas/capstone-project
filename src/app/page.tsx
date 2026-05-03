import "./globals.css";

type Developer = {
  title: string;
  price: string;
};

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">DevConnect</div>

      <ul className="nav-links">
        <span className="bg-blue-300">Home</span>
        <span>About</span>
        <span>Services</span>
        <span>Contact</span>
      </ul>

      <div>
        <button className="btn-outline">Login</button>
        <button className="btn">Register</button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <div className="hero">
      <h1>
        Find the Best Web <br />
        Developers for Your <br />
        Project
      </h1>

      <div className="hero-banner"></div>
    </div>
  );
}

type DeveloperCardProps = {
  data: Developer;
};

function DeveloperCard({ data }: DeveloperCardProps) {
  return (
    <div className="card">
      <div className="image-placeholder"></div>
      <h4>{data.title}</h4>
      <p>{data.price}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <h3>DevConnect</h3>

      <div className="footer-columns">
        <div>Menu</div>
        <div>Services</div>
        <div>Contact</div>
      </div>
    </footer>
  );
}

function App() {
  const developers: Developer[] = [
    { title: "Jhon Doe", price: "$75/hr" },
    { title: "Robert Johnson", price: "$60/hr" },
    { title: "Sarah Williams", price: "$65/hr" },
    { title: "Michael Brown", price: "$70/hr" },
    { title: "Emily Davis", price: "$65/hr" },
    { title: "David Wilson", price: "$60/hr" },
    { title: "Lisa Anderson", price: "$75/hr" },
    { title: "Alex Turner", price: "$55/hr" },
    { title: "Jennifer Lee", price: "$80/hr" },
  ];

  return (
    <div>
      <Navbar />
      <Hero />

      <div className="container">
        <div className="grid">
          {developers.map((dev, index) => (
            <DeveloperCard key={index} data={dev} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;