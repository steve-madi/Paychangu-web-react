import React, { useEffect, useState } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paychanguLoaded, setPaychanguLoaded] = useState(false);
  const [message, setMessage] = useState("");

  const PAYCHANGU_PUBLIC_KEY = "";

  useEffect(() => {
    fetchProducts();
    loadPayChanguScript();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const loadPayChanguScript = () => {
    if (window.PaychanguCheckout) {
      console.log("PayChangu already loaded");
      setPaychanguLoaded(true);
      return;
    }

    const existing = document.querySelector(
      'script[src="https://in.paychangu.com/js/popup.js"]'
    );

    if (existing) {
      console.log("PayChangu script already exists");
      existing.onload = () => setPaychanguLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://in.paychangu.com/js/popup.js";
    script.async = true;

    script.onload = () => {
      console.log("PayChangu script loaded successfully");
      setPaychanguLoaded(true);
    };

    script.onerror = () => {
      console.log("Failed to load PayChangu script");
      setMessage("Failed to load PayChangu popup script.");
    };

    document.body.appendChild(script);
  };

  const makePayment = (product) => {
    console.log("Buy button clicked");

    if (!window.PaychanguCheckout) {
      alert("PayChangu popup is not loaded yet.");
      return;
    }

    const txRef = "STEVE-" + Date.now();

    console.log("Opening PayChangu popup with txRef:", txRef);

    window.PaychanguCheckout({
      public_key: PAYCHANGU_PUBLIC_KEY,
      tx_ref: txRef,
      amount: 1000,
      currency: "MWK",
      callback_url: "http://localhost:3000/callback",
      return_url: "http://localhost:3000/return",
      customer: {
        email: "stevemadi16@gmail.com",
        first_name: "Steve",
        last_name: "Madi",
      },
      customization: {
        title: "Steve Madi Store",
        description: product.title,
      },
      meta: {
        product_id: product.id,
        product_title: product.title,
      },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div id="wrapper"></div>

        <h1 style={styles.heading}>Steve Madi Store</h1>
        <p style={styles.subheading}>React JS + PayChangu Inline Popup</p>

        {message && <div style={styles.alert}>{message}</div>}

        {!paychanguLoaded && (
          <div style={styles.info}>Loading PayChangu checkout...</div>
        )}

        {loading ? (
          <div style={styles.loading}>Loading products...</div>
        ) : (
          <div style={styles.grid}>
            {products.slice(0, 6).map((product) => (
              <div key={product.id} style={styles.card}>
                <div style={styles.imageBox}>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={styles.image}
                  />
                </div>

                <div style={styles.content}>
                  <h3 style={styles.title}>{product.title}</h3>
                  <p style={styles.description}>{product.description}</p>
                </div>

                <div style={styles.footer}>
                  <span style={styles.price}>MWK 1,000</span>
                  <button
                    type="button"
                    style={styles.button}
                    onClick={() => makePayment(product)}
                    disabled={!paychanguLoaded}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "30px 20px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    fontSize: "34px",
    marginBottom: "10px",
    color: "#1e293b",
  },
  subheading: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "30px",
  },
  alert: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },
  info: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#334155",
    marginTop: "50px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
  },
  imageBox: {
    width: "100%",
    height: "220px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: "16px",
    color: "#0f172a",
    marginBottom: "10px",
  },
  description: {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.5",
    minHeight: "70px",
  },
  footer: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#111827",
  },
  button: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
