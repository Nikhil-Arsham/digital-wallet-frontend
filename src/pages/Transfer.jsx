
import { useState } from "react";
import api from "../services/api";
import "../App.css";

function Transfer() {
    const [receiverId, setReceiverId] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleTransfer = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const parsedReceiverId = Number(receiverId);
        const parsedAmount = Number(amount);

        if (!Number.isInteger(parsedReceiverId) || parsedReceiverId <= 0) {
            setError("Please enter a valid receiver user ID.");
            return;
        }

        if (!Number.isFinite(parsedAmount) || parsedAmount < 1) {
            setError("The transfer amount must be at least ₹1.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/api/wallet/transfer", {
                receiverId: parsedReceiverId,
                amount: parsedAmount
            });

            setMessage(
                `Transfer successful! Your new balance is ₹${Number(
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
                "Transfer failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
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

                    <button
                        className="nav-item"
                        onClick={() => window.location.href = "/add-money"}
                    >
                        <span>＋</span> Add Money
                    </button>

                    <button className="nav-item active">
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

                    <button
                        className="sidebar-logout"
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/";
                        }}
                    >
                        ↪ <span>Sign out</span>
                    </button>
                </div>
            </aside>

            <div className="app-main">
                <header className="topbar">
                    <div>
                        <span className="topbar-eyebrow">PAYMENTS</span>
                        <h1>Transfer Money</h1>
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
                        <span className="welcome-tag">QUICK TRANSFER</span>
                        <h2>Send money with confidence.</h2>
                        <p>
                            Transfer virtual funds securely to another wallet user.
                        </p>
                    </section>

                    <div className="transfer-layout">
                        <section className="transfer-form-panel">
                            <div className="transfer-panel-heading">
                                <div className="action-icon">↗</div>
                                <div>
                                    <h2>New transfer</h2>
                                    <p>Enter the recipient and amount.</p>
                                </div>
                            </div>

                            <form onSubmit={handleTransfer}>
                                <div className="form-group">
                                    <label htmlFor="receiverId">
                                        Receiver user ID
                                    </label>

                                    <input
                                        id="receiverId"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={receiverId}
                                        onChange={(event) =>
                                            setReceiverId(event.target.value)
                                        }
                                        placeholder="For example, 2"
                                        required
                                    />

                                    <small className="field-help">
                                        Enter the recipient's registered user ID.
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="amount">
                                        Transfer amount
                                    </label>

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

                                {error && (
                                    <div className="error-message" role="alert">
                                        {error}
                                    </div>
                                )}

                                {message && (
                                    <div className="success-message" role="status">
                                        ✓ {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="primary-action-button"
                                    disabled={loading}
                                >
                                    {loading ? "Processing transfer..." : "Confirm transfer →"}
                                </button>
                            </form>

                            <p className="transfer-note">
                                This application uses virtual funds only.
                                Review the recipient and amount before confirming.
                            </p>
                        </section>

                        <aside className="transfer-side-panel">
                            <div className="transfer-illustration">↗</div>
                            <span className="welcome-tag">SIMPLE & SECURE</span>
                            <h3>Money movement, made simple.</h3>
                            <p>
                                Your backend checks the balance, updates both
                                wallets, and records the transfer in a database
                                transaction.
                            </p>

                            <div className="transfer-security-point">
                                <span>✓</span>
                                <div>
                                    <strong>Authenticated request</strong>
                                    <small>JWT-secured API access</small>
                                </div>
                            </div>

                            <div className="transfer-security-point">
                                <span>✓</span>
                                <div>
                                    <strong>Balance validation</strong>
                                    <small>Insufficient funds are rejected</small>
                                </div>
                            </div>

                            <div className="transfer-security-point">
                                <span>✓</span>
                                <div>
                                    <strong>Transaction record</strong>
                                    <small>Successful transfers are recorded</small>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Transfer;
