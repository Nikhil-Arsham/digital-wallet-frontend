
import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [walletId, setWalletId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        const loadTransactions = async () => {
            if (!localStorage.getItem("token")) {
                window.location.href = "/";
                return;
            }

            try {
                const [walletResponse, transactionResponse] =
                    await Promise.all([
                        api.get("/api/wallet"),
                        api.get("/api/transactions")
                    ]);

                setWalletId(Number(walletResponse.data.id));
                setTransactions(transactionResponse.data);
            } catch (err) {
                if ([401, 403].includes(err.response?.status)) {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                    return;
                }

                setError("Unable to load transactions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const getDirection = (transaction) => {
        if (transaction.type === "ADD_MONEY") return "CREDIT";
        if (Number(transaction.senderWalletId) === walletId) return "DEBIT";
        if (Number(transaction.receiverWalletId) === walletId) return "CREDIT";
        return "OTHER";
    };

    const filteredTransactions = transactions.filter((transaction) => {
        if (filter === "ALL") return true;
        return getDirection(transaction) === filter;
    });

    const formatAmount = (amount) =>
        Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

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
                    <button className="nav-item"
                        onClick={() => window.location.href = "/dashboard"}>
                        <span>▦</span> Dashboard
                    </button>
                    <button className="nav-item"
                        onClick={() => window.location.href = "/add-money"}>
                        <span>＋</span> Add Money
                    </button>
                    <button className="nav-item"
                        onClick={() => window.location.href = "/transfer"}>
                        <span>↗</span> Transfer Money
                    </button>
                    <button className="nav-item active">
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
                        <span className="topbar-eyebrow">ACTIVITY</span>
                        <h1>Transactions</h1>
                    </div>
                    <button className="logout-button"
                        onClick={() => window.location.href = "/dashboard"}>
                        Back to Dashboard
                    </button>
                </header>

                <main className="dashboard-content">
                    <section className="welcome-section">
                        <span className="welcome-tag">TRANSACTION HISTORY</span>
                        <h2>Every movement, accounted for.</h2>
                        <p>Review your wallet top-ups and transfers in one place.</p>
                    </section>

                    <section className="transactions-panel">
                        <div className="transactions-heading">
                            <div>
                                <h2>Recent activity</h2>
                                <p>{transactions.length} transaction(s) recorded</p>
                            </div>

                            <button className="transaction-refresh"
                                onClick={() => window.location.reload()}>
                                ↻ Refresh
                            </button>
                        </div>

                        <div className="transaction-filters">
                            {[
                                { label: "All activity", value: "ALL" },
                                { label: "Money received", value: "CREDIT" },
                                { label: "Money sent", value: "DEBIT" }
                            ].map((item) => (
                                <button
                                    key={item.value}
                                    className={filter === item.value
                                        ? "transaction-filter active"
                                        : "transaction-filter"}
                                    onClick={() => setFilter(item.value)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="transaction-empty">
                                Loading your transactions...
                            </div>
                        ) : error ? (
                            <div className="error-message">{error}</div>
                        ) : filteredTransactions.length === 0 ? (
                            <div className="transaction-empty">
                                <div className="transaction-empty-icon">↕</div>
                                <h3>No transactions found</h3>
                                <p>Your activity will appear here after a top-up or transfer.</p>
                            </div>
                        ) : (
                            <div className="transaction-list">
                                {filteredTransactions.map((transaction) => {
                                    const direction = getDirection(transaction);
                                    const isCredit = direction === "CREDIT";

                                    return (
                                        <div className="transaction-row"
                                            key={transaction.id}>
                                            <div className={
                                                isCredit
                                                    ? "transaction-icon credit"
                                                    : "transaction-icon debit"
                                            }>
                                                {transaction.type === "ADD_MONEY"
                                                    ? "＋"
                                                    : isCredit ? "↙" : "↗"}
                                            </div>

                                            <div className="transaction-details">
                                                <strong>
                                                    {transaction.type === "ADD_MONEY"
                                                        ? "Wallet top-up"
                                                        : isCredit
                                                            ? "Money received"
                                                            : "Money sent"}
                                                </strong>
                                                <span>
                                                    {transaction.createdAt
                                                        ? new Date(transaction.createdAt)
                                                            .toLocaleString("en-IN")
                                                        : "Date unavailable"}
                                                </span>
                                                <small>
                                                    Transaction #{transaction.id}
                                                    {" · "}
                                                    {transaction.status || "RECORDED"}
                                                </small>
                                            </div>

                                            <div className="transaction-amount">
                                                <strong className={
                                                    isCredit ? "credit-text" : "debit-text"
                                                }>
                                                    {isCredit ? "+" : "−"}₹
                                                    {formatAmount(transaction.amount)}
                                                </strong>
                                                <span className={
                                                    isCredit ? "credit-status" : "debit-status"
                                                }>
                                                    {isCredit ? "CREDIT" : "DEBIT"}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <footer className="dashboard-footer">
                        <span>WalletFlow · Transaction history</span>
                        <span>Virtual money simulation only</span>
                    </footer>
                </main>
            </div>
        </div>
    );
}

export default Transactions;
