
import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";

function Dashboard() {
    const [wallet, setWallet] = useState(null);
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            if (!localStorage.getItem("token")) {
                window.location.href = "/";
                return;
            }

            try {
                const [walletResponse, userResponse, transactionResponse] =
                    await Promise.all([
                        api.get("/api/wallet"),
                        api.get("/api/users/me"),
                        api.get("/api/transactions")
                    ]);

                setWallet(walletResponse.data);
                setUser(userResponse.data);
                setTransactions(
                    Array.isArray(transactionResponse.data)
                        ? transactionResponse.data
                        : []
                );
            } catch (err) {
                if ([401, 403].includes(err.response?.status)) {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                    return;
                }

                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const hasAdminAccess = () => {
        const role = user?.role;
        const roles = user?.roles;

        return (
            role === "ADMIN" ||
            role === "ROLE_ADMIN" ||
            (Array.isArray(roles) &&
                roles.some((item) => {
                    const value =
                        typeof item === "string" ? item : item?.name;

                    return value === "ADMIN" || value === "ROLE_ADMIN";
                }))
        );
    };

    const formatMoney = (amount) =>
        Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const sortedTransactions = [...transactions].sort(
        (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
    );

    const getTransactionDirection = (transaction) => {
        if (transaction.type === "ADD_MONEY") return "CREDIT";

        if (
            Number(transaction.receiverWalletId) === Number(wallet?.id)
        ) {
            return "CREDIT";
        }

        if (
            Number(transaction.senderWalletId) === Number(wallet?.id)
        ) {
            return "DEBIT";
        }

        return "OTHER";
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
                        className="nav-item active"
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

                    {hasAdminAccess() && (
                        <button
                            className="nav-item admin-nav-item"
                            onClick={() => window.location.href = "/admin"}
                        >
                            <span>⚙</span> Admin Dashboard
                        </button>
                    )}
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
                        <span className="topbar-eyebrow">
                            PERSONAL FINANCE
                        </span>
                        <h1>Dashboard</h1>
                    </div>

                    <div className="profile-chip">
                        <div className="profile-avatar">
                            {(user?.name || user?.email || "U")
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                        <div>
                            <strong>{user?.name || "Wallet User"}</strong>
                            <span>{user?.email || "Your wallet"}</span>
                        </div>
                    </div>
                </header>

                <main className="dashboard-content">
                    <section className="welcome-section">
                        <span className="welcome-tag">
                            YOUR FINANCIAL SPACE
                        </span>
                        <h2>
                            Welcome back
                            {user?.name
                                ? `, ${user.name.split(" ")[0]}`
                                : ""}!
                        </h2>
                        <p>
                            Manage your virtual money and track every
                            transaction from one place.
                        </p>
                    </section>

                    {loading ? (
                        <div className="transaction-empty">
                            Loading your wallet...
                        </div>
                    ) : error ? (
                        <div className="error-message" role="alert">
                            {error}
                        </div>
                    ) : (
                        <>
                            <section className="balance-card">
                                <div className="balance-decoration balance-decoration-one" />
                                <div className="balance-decoration balance-decoration-two" />

                                <div className="balance-heading">
                                    <div>
                                        <span className="balance-caption">
                                            TOTAL WALLET BALANCE
                                        </span>
                                        <h2>
                                            ₹{formatMoney(wallet?.balance)}
                                        </h2>
                                    </div>

                                    <div className="wallet-id-badge">
                                        <span>◈</span> Digital Wallet
                                    </div>
                                </div>

                                <div className="balance-card-footer">
                                    <div>
                                        <span>Wallet ID</span>
                                        <strong>
                                            #{wallet?.id ?? "—"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Account status</span>
                                        <strong className="info-status">
                                            ● Active
                                        </strong>
                                    </div>
                                </div>
                            </section>

                            <section className="action-section">
                                <div className="section-heading">
                                    <div>
                                        <h2>Quick actions</h2>
                                        <p>What would you like to do today?</p>
                                    </div>
                                </div>

                                <div className="action-grid">
                                    <button
                                        className="action-card action-add"
                                        onClick={() => window.location.href = "/add-money"}
                                    >
                                        <div className="action-icon">＋</div>
                                        <h3>Add Money</h3>
                                        <p>
                                            Add virtual funds to your wallet.
                                        </p>
                                        <span>Top up wallet →</span>
                                    </button>

                                    <button
                                        className="action-card action-transfer"
                                        onClick={() => window.location.href = "/transfer"}
                                    >
                                        <div className="action-icon">↗</div>
                                        <h3>Transfer Money</h3>
                                        <p>
                                            Send virtual funds to another wallet.
                                        </p>
                                        <span>Make a transfer →</span>
                                    </button>

                                    <button
                                        className="action-card action-history"
                                        onClick={() => window.location.href = "/transactions"}
                                    >
                                        <div className="action-icon">↕</div>
                                        <h3>Transactions</h3>
                                        <p>
                                            Review your wallet activity.
                                        </p>
                                        <span>View history →</span>
                                    </button>
                                </div>
                            </section>

                            <section className="transactions-panel dashboard-recent-panel">
                                <div className="transactions-heading">
                                    <div>
                                        <h2>Recent activity</h2>
                                        <p>Your latest wallet transactions</p>
                                    </div>

                                    <button
                                        className="transaction-refresh"
                                        onClick={() =>
                                            window.location.href = "/transactions"
                                        }
                                    >
                                        View all →
                                    </button>
                                </div>

                                {sortedTransactions.length === 0 ? (
                                    <div className="transaction-empty">
                                        No transactions yet. Add money or
                                        make a transfer to get started.
                                    </div>
                                ) : (
                                    <div className="transaction-list">
                                        {sortedTransactions
                                            .slice(0, 5)
                                            .map((tx) => {
                                                const direction =
                                                    getTransactionDirection(tx);
                                                const isCredit =
                                                    direction === "CREDIT";

                                                return (
                                                    <div
                                                        className="transaction-row"
                                                        key={tx.id}
                                                    >
                                                        <div
                                                            className={
                                                                isCredit
                                                                    ? "transaction-icon credit"
                                                                    : "transaction-icon debit"
                                                            }
                                                        >
                                                            {tx.type === "ADD_MONEY"
                                                                ? "＋"
                                                                : isCredit
                                                                    ? "↙"
                                                                    : "↗"}
                                                        </div>

                                                        <div className="transaction-details">
                                                            <strong>
                                                                {tx.type === "ADD_MONEY"
                                                                    ? "Wallet top-up"
                                                                    : isCredit
                                                                        ? "Money received"
                                                                        : "Money sent"}
                                                            </strong>

                                                            <span>
                                                                {tx.createdAt
                                                                    ? new Date(tx.createdAt)
                                                                        .toLocaleString("en-IN")
                                                                    : "Date unavailable"}
                                                            </span>

                                                            <small>
                                                                Transaction #{tx.id}
                                                            </small>
                                                        </div>

                                                        <div className="transaction-amount">
                                                            <strong
                                                                className={
                                                                    isCredit
                                                                        ? "credit-text"
                                                                        : "debit-text"
                                                                }
                                                            >
                                                                {isCredit ? "+" : "−"}₹
                                                                {formatMoney(tx.amount)}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </section>

                            <section className="dashboard-info">
                                <div className="info-icon">◈</div>
                                <div>
                                    <h3>Your wallet is protected</h3>
                                    <p>
                                        Authenticated requests use JWT.
                                        Transfers are validated by the backend,
                                        and this application simulates virtual
                                        money only.
                                    </p>
                                </div>
                                <span className="info-status">
                                    SECURE SESSION
                                </span>
                            </section>

                            <footer className="dashboard-footer">
                                <span>WalletFlow · Digital Wallet</span>
                                <span>
                                    Built with Spring Boot, React and MySQL
                                </span>
                            </footer>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
