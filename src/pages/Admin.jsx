
import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";

function Admin() {
    const [users, setUsers] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAdminData = async () => {
            if (!localStorage.getItem("token")) {
                window.location.href = "/";
                return;
            }

            try {
                const [u, w, t] = await Promise.all([
                    api.get("/api/admin/users"),
                    api.get("/api/admin/wallets"),
                    api.get("/api/admin/transactions")
                ]);

                setUsers(u.data);
                setWallets(w.data);
                setTransactions(t.data);
            } catch (err) {
                if ([401, 403].includes(err.response?.status)) {
                    setError(
                        err.response.status === 403
                            ? "Access denied. Admin privileges are required."
                            : "Session expired. Please log in again."
                    );

                    if (err.response.status === 401) {
                        localStorage.removeItem("token");
                    }
                } else {
                    setError("Unable to load admin data. Check the backend APIs.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const money = (amount) =>
        Number(amount || 0).toLocaleString("en-IN", {
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
                        <span>Admin Console</span>
                    </div>
                </div>

                <p className="sidebar-label">ADMINISTRATION</p>

                <nav className="sidebar-nav">
                    <button className="nav-item active">
                        <span>▦</span> Overview
                    </button>
                    <button className="nav-item"
                        onClick={() => window.location.href = "/dashboard"}>
                        <span>⌂</span> User Dashboard
                    </button>
                    <button className="nav-item"
                        onClick={() => window.location.href = "/transactions"}>
                        <span>↕</span> Transactions
                    </button>
                </nav>

                <div className="sidebar-bottom">
                    <div className="security-note">
                        <span>◈</span>
                        <strong>Admin Access</strong>
                        <p>Role-protected APIs</p>
                    </div>
                    <button className="sidebar-logout" onClick={logout}>
                        ↪ <span>Sign out</span>
                    </button>
                </div>
            </aside>

            <div className="app-main">
                <header className="topbar">
                    <div>
                        <span className="topbar-eyebrow">CONTROL CENTER</span>
                        <h1>Admin Overview</h1>
                    </div>
                    <button className="logout-button"
                        onClick={() => window.location.href = "/dashboard"}>
                        User Dashboard
                    </button>
                </header>

                <main className="dashboard-content">
                    <section className="welcome-section">
                        <span className="welcome-tag">SYSTEM MANAGEMENT</span>
                        <h2>WalletFlow at a glance.</h2>
                        <p>Monitor registered users, wallet balances and transaction activity.</p>
                    </section>

                    {error && <div className="error-message">{error}</div>}

                    {loading ? (
                        <div className="transaction-empty">Loading admin data...</div>
                    ) : !error && (
                        <>
                            <div className="admin-stats">
                                <div className="admin-stat-card stat-blue">
                                    <span>REGISTERED USERS</span>
                                    <strong>{users.length}</strong>
                                    <small>Accounts in the system</small>
                                </div>
                                <div className="admin-stat-card stat-purple">
                                    <span>WALLETS</span>
                                    <strong>{wallets.length}</strong>
                                    <small>Wallet records</small>
                                </div>
                                <div className="admin-stat-card stat-green">
                                    <span>TRANSACTIONS</span>
                                    <strong>{transactions.length}</strong>
                                    <small>Recorded activities</small>
                                </div>
                                <div className="admin-stat-card stat-orange">
                                    <span>TOTAL WALLET BALANCE</span>
                                    <strong>₹{money(
                                        wallets.reduce(
                                            (sum, wallet) =>
                                                sum + Number(wallet.balance || 0), 0
                                        )
                                    )}</strong>
                                    <small>Combined virtual funds</small>
                                </div>
                            </div>

                            <section className="admin-table-panel">
                                <div className="transactions-heading">
                                    <div>
                                        <h2>Registered users</h2>
                                        <p>User accounts returned by the backend</p>
                                    </div>
                                </div>
                                <div className="admin-table-scroll">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>User</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td>#{user.id}</td>
                                                    <td>{user.name || "—"}</td>
                                                    <td>{user.email || "—"}</td>
                                                    <td>
                                                        <span className="admin-role">
                                                            {Array.isArray(user.roles)
                                                                ? user.roles.join(", ")
                                                                : user.role || "USER"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {users.length === 0 && (
                                        <p className="admin-no-data">No users found.</p>
                                    )}
                                </div>
                            </section>

                            <section className="admin-table-panel">
                                <div className="transactions-heading">
                                    <div>
                                        <h2>Wallets</h2>
                                        <p>Current balances across all wallets</p>
                                    </div>
                                </div>
                                <div className="admin-table-scroll">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Wallet ID</th>
                                                <th>Owner ID</th>
                                                <th>Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wallets.map((wallet) => (
                                                <tr key={wallet.id}>
                                                    <td>#{wallet.id}</td>
                                                    <td>{wallet.userId ?? wallet.user?.id ?? "—"}</td>
                                                    <td className="admin-balance">
                                                        ₹{money(wallet.balance)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {wallets.length === 0 && (
                                        <p className="admin-no-data">No wallets found.</p>
                                    )}
                                </div>
                            </section>

                            <section className="admin-table-panel">
                                <div className="transactions-heading">
                                    <div>
                                        <h2>Latest transactions</h2>
                                        <p>Most recent records first</p>
                                    </div>
                                </div>
                                <div className="admin-table-scroll">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Type</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...transactions]
                                                .sort((a, b) =>
                                                    new Date(b.createdAt || 0) -
                                                    new Date(a.createdAt || 0)
                                                )
                                                .map((tx) => (
                                                    <tr key={tx.id}>
                                                        <td>#{tx.id}</td>
                                                        <td>{tx.type || "—"}</td>
                                                        <td className="admin-balance">
                                                            ₹{money(tx.amount)}
                                                        </td>
                                                        <td>
                                                            <span className="admin-role">
                                                                {tx.status || "RECORDED"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {tx.createdAt
                                                                ? new Date(tx.createdAt)
                                                                    .toLocaleString("en-IN")
                                                                : "—"}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                    {transactions.length === 0 && (
                                        <p className="admin-no-data">No transactions found.</p>
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Admin;
