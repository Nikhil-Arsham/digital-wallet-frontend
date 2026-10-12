
import { useState } from "react";
import api from "../services/api";
import "../App.css";

function AddMoney() {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleAddMoney = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        const parsedAmount = Number(amount);

        if (!Number.isFinite(parsedAmount) || parsedAmount < 1) {
            setError("Amount must be at least ₹1.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/api/wallet/add-money", {
                amount: parsedAmount
            });

            setMessage(
                `Money added successfully! Your new balance is ₹${Number(
                    response.data.balance
                ).toFixed(2)}.`
            );
            setAmount("");
        } catch (err) {
            if ([401, 403].includes(err.response?.status)) {
                localStorage.removeItem("token");
                window.location.href = "/";
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to add money. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className="app-layout">
            <aside className="app-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-mark">W</div>
                    <div>
                        <strong>WalletFlow</strong>
                        <span>Digital Payments</span>
                    </div>
                </div>

                <p className="sidebar-label">WORKSPACE</p>

                <nav className="sidebar-nav">
                    <button
                        className="nav-item"
                        onClick={() => window.location.href = "/dashboard"}
                    >
                        <span>▦</span> Dashboard
                    </button>

                    <button className="nav-item active">
                        <span>＋</span> Add Money
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => window.location.href = "/transfer"}
                    >
                        <span>↗</span> Transfer Money
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => window.location.href = "/transactions"}
                    >
                        <span>↕</span> Transactions
                    </button>
                </nav>

                <div className="sidebar-bottom">
                    <div className="security-note">
                        <span>◈</span>
                        <strong>Secure Wallet</strong>
                        <p>JWT protected access</p>
                    </div>

                    <button className="sidebar-logout" onClick={logout}>
                        ↪ <span>Sign out</span>
                    </button>
                </div>
            </aside>

            <div className="app-main">
                <header className="topbar">
                    <div>
                        <span className="topbar-eyebrow">WALLET</span>
                        <h1>Add Money</h1>
                    </div>

                    <button
                        className="logout-button"
                        onClick={() => window.location.href = "/dashboard"}
                    >
                        Back to Dashboard
                    </button>
                </header>

                <main className="dashboard-content">
                    <section className="welcome-section">
                        <span className="welcome-tag">WALLET TOP-UP</span>
                        <h2>Give your wallet a boost.</h2>
                        <p>
                            Add virtual funds and see your balance update instantly.
                        </p>
                    </section>

                    <div className="transfer-layout">
                        <section className="transfer-form-panel">
                            <div className="transfer-panel-heading">
                                <div className="action-icon">＋</div>
                                <div>
                                    <h2>Add virtual money</h2>
                                    <p>Enter the amount you want to add.</p>
                                </div>
                            </div>

                            <form onSubmit={handleAddMoney}>
                                <div className="form-group">
                                    <label htmlFor="amount">Amount</label>

                                    <div className="amount-input">
                                        <span>₹</span>
                                        <input
                                            id="amount"
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            value={amount}
                                            onChange={(event) =>
                                                setAmount(event.target.value)
                                            }
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="amount-presets">
                                    {[100, 500, 1000, 2000].map((value) => (
                                        <button
                                            type="button"
                                            key={value}
                                            className={
                                                Number(amount) === value
                                                    ? "amount-preset selected"
                                                    : "amount-preset"
                                            }
                                            onClick={() =>
                                                setAmount(String(value))
                                            }
                                        >
                                            ₹{value.toLocaleString("en-IN")}
                                        </button>
                                    ))}
                                </div>

                                {error && (
                                    <div className="error-message" role="alert">
                                        {error}
                                    </div>
                                )}

                                {message && (
                                    <div
                                        className="success-message"
                                        role="status"
                                    >
                                        ✓ {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="primary-action-button"
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Add Money →"}
                                </button>
                            </form>

                            <p className="transfer-note">
                                This is a simulated wallet. No real payment
                                or bank transaction takes place.
                            </p>
                        </section>

                        <aside className="transfer-side-panel add-money-side">
                            <div className="transfer-illustration">₹</div>
                            <span className="welcome-tag">QUICK TOP-UP</span>
                            <h3>Your wallet, ready for what's next.</h3>
                            <p>
                                Every successful top-up updates your wallet
                                balance and creates a transaction record.
                            </p>

                            <div className="transfer-security-point">
                                <span>✓</span>
                                <div>
                                    <strong>Instant balance update</strong>
                                    <small>Read from your backend response</small>
                                </div>
                            </div>

                            <div className="transfer-security-point">
                                <span>✓</span>
                                <div>
                                    <strong>Transaction history</strong>
                                    <small>Each top-up is recorded</small>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AddMoney;
