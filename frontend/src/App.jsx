
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Wallet,
  LayoutDashboard,
  ArrowLeftRight,
  Plus,
  Search,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  RefreshCw,
  CalendarDays,
  CircleDollarSign,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const EMPTY_FORM = {
  title: "",
  amount: "",
  type: "expense",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  description: "",
};

const CATEGORIES = [
  "Food",
  "Salary",
  "Shopping",
  "Transport",
  "Bills",
  "Education",
  "Health",
  "Entertainment",
  "Freelance",
  "Investment",
  "Other",
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activePage, setActivePage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}/transactions`);
      setTransactions(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load transactions. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const expenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const visibleTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const query = search.toLowerCase();
      const matchesSearch = [
        item.title,
        item.description,
        item.category,
        item.type,
      ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesType = filter === "all" || item.type === filter;

      const matchesPage =
        activePage !== "Income" && activePage !== "Expenses"
          ? true
          : item.type === (activePage === "Income" ? "income" : "expense");

      return matchesSearch && matchesType && matchesPage;
    });
  }, [transactions, search, filter, activePage]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function openEdit(item) {
    setForm({
      title: item.title || "",
      amount: String(item.amount ?? ""),
      type: item.type || "expense",
      category: item.category || "Other",
      date: item.date
        ? new Date(item.date).toISOString().slice(0, 10)
        : EMPTY_FORM.date,
      description: item.description || "",
    });

    setEditingId(item._id);
    setActivePage("Add Transaction");
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      amount: Number(form.amount),
      description: form.description.trim(),
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/transactions/${editingId}`, payload);
        showNotice("Transaction updated successfully.");
      } else {
        await axios.post(`${API_URL}/transactions`, payload);
        showNotice("Transaction added successfully.");
      }

      resetForm();
      setActivePage("Transactions");
      await loadTransactions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not save the transaction. Please check your input and API."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/transactions/${item._id}`);
      setTransactions((current) =>
        current.filter((transaction) => transaction._id !== item._id)
      );
      showNotice("Transaction deleted successfully.");

      if (editingId === item._id) resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete the transaction."
      );
    }
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Transactions", icon: ArrowLeftRight },
    { label: "Income", icon: TrendingUp },
    { label: "Expenses", icon: TrendingDown },
    { label: "Add Transaction", icon: Plus },
  ];

  function navigate(label) {
    setActivePage(label);
    setMenuOpen(false);
    setError("");
    if (label !== "Add Transaction") resetForm();
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <a className="brand" href="#dashboard" onClick={() => navigate("Dashboard")}>
          <span className="brand-icon"><Wallet size={25} /></span>
          <span>Budget<span className="brand-accent">Track</span></span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-link ${activePage === label ? "active" : ""}`}
              onClick={() => navigate(label)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Add Transaction" && <Plus className="nav-plus" size={16} />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status">
            <span className="status-dot" />
            <span>API connection</span>
            <span className="status-live">LIVE</span>
          </div>
          <p>Your money, organized.</p>
          <small>BudgetTrack · REST API</small>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <span className="api-indicator">
              <span className="status-dot" /> MongoDB API
            </span>
            <button
              className="icon-button"
              aria-label="Refresh transactions"
              title="Refresh transactions"
              onClick={loadTransactions}
            >
              <RefreshCw size={18} />
            </button>
            <div className="avatar">AV</div>
          </div>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">YOUR FINANCES AT A GLANCE</div>
              <h1>
                {activePage === "Dashboard" ? "Welcome back." : activePage}
              </h1>
              <p className="page-subtitle">
                {activePage === "Dashboard"
                  ? "Here is what's happening with your money."
                  : activePage === "Add Transaction"
                    ? "Record a new transaction or update an existing one."
                    : "Manage and review your financial activity."}
              </p>
            </div>
            <div className="today-pill">
              <CalendarDays size={17} />
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          {notice && <div className="notice-banner">{notice}</div>}

          {error && (
            <div className="error-banner">
              <AlertCircle size={19} />
              <span>{error}</span>
              <button onClick={() => setError("")} aria-label="Dismiss error">
                <X size={17} />
              </button>
            </div>
          )}

          {(activePage === "Dashboard" || activePage === "Income" || activePage === "Expenses") && (
            <div className="summary-grid">
              <SummaryCard
                label="Total Income"
                amount={totals.income}
                icon={TrendingUp}
                kind="income"
                description="All recorded income"
              />
              <SummaryCard
                label="Total Expenses"
                amount={totals.expenses}
                icon={TrendingDown}
                kind="expense"
                description="All recorded expenses"
              />
              <SummaryCard
                label="Current Balance"
                amount={totals.balance}
                icon={Wallet}
                kind="balance"
                description="Income minus expenses"
              />
            </div>
          )}

          {activePage === "Add Transaction" ? (
            <section className="panel form-panel">
              <div className="panel-heading">
                <div>
                  <h2>{editingId ? "Edit transaction" : "Add a transaction"}</h2>
                  <p>Keep your financial records up to date.</p>
                </div>
                <span className="panel-heading-icon"><CircleDollarSign size={22} /></span>
              </div>

              <form className="transaction-form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label htmlFor="title">Transaction title *</label>
                  <input
                    id="title"
                    required
                    maxLength={100}
                    placeholder="e.g. Monthly salary"
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="amount">Amount (₹) *</label>
                    <input
                      id="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      placeholder="e.g. 2500"
                      value={form.amount}
                      onChange={(event) => setForm({ ...form, amount: event.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="date">Date *</label>
                    <input
                      id="date"
                      type="date"
                      required
                      value={form.date}
                      onChange={(event) => setForm({ ...form, date: event.target.value })}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Transaction type *</label>
                  <div className="type-selector">
                    {["income", "expense"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`type-option ${type} ${form.type === type ? "selected" : ""}`}
                        onClick={() =>
                          setForm({
                            ...form,
                            type,
                            category: type === "income" ? "Salary" : "Food",
                          })
                        }
                      >
                        {type === "income" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        {type === "income" ? "Income" : "Expense"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    required
                    value={form.category}
                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="description">Notes <span>(optional)</span></label>
                  <textarea
                    id="description"
                    rows="3"
                    maxLength={500}
                    placeholder="Add a short note..."
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                  />
                </div>

                <div className="form-actions">
                  {editingId && (
                    <button type="button" className="secondary-button" onClick={resetForm}>
                      Cancel edit
                    </button>
                  )}
                  <button type="submit" className="primary-button" disabled={saving}>
                    {saving ? <LoaderCircle className="spin" size={18} /> : <Plus size={18} />}
                    {saving ? "Saving..." : editingId ? "Save changes" : "Add transaction"}
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <section className="panel transactions-panel">
              <div className="panel-heading transactions-heading">
                <div>
                  <h2>{activePage === "Dashboard" ? "Recent transactions" : `${activePage} records`}</h2>
                  <p>Your records, synced with the database.</p>
                </div>
                <button
                  className="primary-button compact-button"
                  onClick={() => navigate("Add Transaction")}
                >
                  <Plus size={17} /> Add new
                </button>
              </div>

              <div className="table-tools">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search transactions..."
                    aria-label="Search transactions"
                  />
                  {search && (
                    <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <select
                  className="filter-select"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  aria-label="Filter transaction type"
                >
                  <option value="all">All types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expenses</option>
                </select>
              </div>

              {loading ? (
                <div className="loading-state">
                  <LoaderCircle className="spin" size={28} />
                  <span>Loading transactions...</span>
                </div>
              ) : visibleTransactions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><Wallet size={27} /></div>
                  <h3>No transactions found</h3>
                  <p>Add a record or try changing your search.</p>
                  <button className="primary-button" onClick={() => navigate("Add Transaction")}>
                    <Plus size={17} /> Add transaction
                  </button>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Transaction</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th className="amount-cell">Amount</th>
                        <th className="actions-cell">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleTransactions.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div className="transaction-title">{item.title}</div>
                            {item.description && (
                              <div className="transaction-description">{item.description}</div>
                            )}
                          </td>
                          <td><span className="category-label">{item.category || "Other"}</span></td>
                          <td>
                            <span className={`type-badge ${item.type}`}>
                              {item.type === "income" ? "Income" : "Expense"}
                            </span>
                          </td>
                          <td className="date-cell">
                            {item.date
                              ? new Date(item.date).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>
                          <td className={`amount-cell amount-${item.type}`}>
                            {item.type === "income" ? "+" : "−"}{money(item.amount)}
                          </td>
                          <td className="actions-cell">
                            <div className="row-actions">
                              <button className="action-button edit-action" title="Edit" aria-label={`Edit ${item.title}`} onClick={() => openEdit(item)}>
                                <Pencil size={15} />
                              </button>
                              <button className="action-button delete-action" title="Delete" aria-label={`Delete ${item.title}`} onClick={() => handleDelete(item)}>
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && visibleTransactions.length > 0 && (
                <div className="table-footer">
                  <span>Showing {visibleTransactions.length} of {transactions.length} records</span>
                  <span className="database-label"><span className="status-dot" /> Live database data</span>
                </div>
              )}
            </section>
          )}

          <footer className="app-footer">
            <span>© {new Date().getFullYear()} BudgetTrack</span>
            <span>Built with React · Express · MongoDB</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ label, amount, icon: Icon, kind, description }) {
  return (
    <article className={`summary-card ${kind}`}>
      <div className="summary-icon"><Icon size={23} /></div>
      <div className="summary-info">
        <span className="summary-label">{label}</span>
        <strong className="summary-amount">{money(amount)}</strong>
        <span className="summary-description">{description}</span>
      </div>
      <div className={`summary-mark ${kind}`}>
        {kind === "income" ? <TrendingUp size={17} /> : kind === "expense" ? <TrendingDown size={17} /> : <Wallet size={17} />}
      </div>
    </article>
  );
}

export default App;
