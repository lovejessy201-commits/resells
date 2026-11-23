import { useState } from 'react'
import { Search, Heart, ShoppingBag, Menu, X, Plus, ArrowRight, Car, Smartphone, Shirt, Laptop, ShieldCheck, Zap, BadgeDollarSign, ChevronDown } from 'lucide-react'

const categories = [
  { name: 'Cars', count: '3,240', icon: Car, tone: 'sage' },
  { name: 'Phones', count: '8,192', icon: Smartphone, tone: 'sand' },
  { name: 'Clothes', count: '12,408', icon: Shirt, tone: 'blue' },
  { name: 'Computers', count: '2,981', icon: Laptop, tone: 'peach' },
]

const listings = [
  { name: '2021 Range Rover Sport', category: 'Cars', price: '$32,800', meta: '18k miles · Automatic', tone: 'car', badge: 'Great price', image: 'https://media.cdn-jaguarlandrover.com/api/v2/images/121525/w/640/h/360.jpg' },
  { name: 'iPhone 15 Pro, 256GB', category: 'Phones', price: '$749', meta: 'Excellent · 1 year old', tone: 'phone', badge: 'Verified', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=640&q=85' },
  { name: 'Linen summer set', category: 'Clothes', price: '$48', meta: 'Size M · Like new', tone: 'cloth', badge: 'Popular' },
  { name: 'MacBook Air M2', category: 'Computers', price: '$899', meta: '16GB · 512GB · 2023', tone: 'computer', badge: 'Top deal', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=85' },
]

function ProductVisual({ tone, image, name }) {
  const icons = { car: '🚙', phone: '📱', cloth: '👕', computer: '💻' }
  return (
    <div className={`product-visual ${tone}`}>
      {image
        ? <img className="product-photo" src={image} alt={name} />
        : <span>{icons[tone]}</span>}
      <div className="visual-shadow" />
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sellOpen, setSellOpen] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [search, setSearch] = useState('')

  const toggleFavorite = (name) => setFavorites((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name])

  return (
    <>
      <header>
        <nav className="nav shell">
          <button className="menu-button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          <a className="brand" href="#"><span className="brand-mark">R</span><span>ReMarket</span></a>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#browse">Browse</a><a href="#categories">Categories</a><a href="#how">How it works</a>
          </div>
          <div className="nav-actions">
            <button className="icon-button" aria-label="Favorites"><Heart size={20} /><span className="count">{favorites.length}</span></button>
            <button className="sell-button" onClick={() => setSellOpen(true)}><Plus size={18} /> Sell item</button>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Your local marketplace</p>
            <h1>Find a good deal.<br/><em>Make a fresh start.</em></h1>
            <p className="hero-sub">Buy and sell quality finds in your community — from everyday essentials to dream rides.</p>
            <div className="search-wrap">
              <Search size={21} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="What are you looking for?" />
              <button>Search</button>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-circle" />
            <div className="floating-card card-one"><span>👟</span><div><small>Fresh find</small><strong>$42</strong></div></div>
            <div className="hero-phone">📱</div>
            <div className="floating-card card-two"><span>🚲</span><div><small>Near you</small><strong>$180</strong></div></div>
          </div>
        </section>

        <section className="categories shell" id="categories">
          <div className="section-heading"><div><p className="section-kicker">Explore</p><h2>Browse by category</h2></div><a href="#browse">View all <ArrowRight size={16}/></a></div>
          <div className="category-grid">
            {categories.map(({ name, count, icon: Icon, tone }) => (
              <button className={`category-card ${tone}`} key={name} onClick={() => setSearch(name)}>
                <span className="category-icon"><Icon size={28} /></span>
                <div><h3>{name}</h3><p>{count} listings</p></div>
                <ArrowRight className="category-arrow" size={20}/>
              </button>
            ))}
          </div>
        </section>

        <section className="featured shell" id="browse">
          <div className="section-heading"><div><p className="section-kicker">Just for you</p><h2>Fresh listings</h2></div><button className="filter">All listings <ChevronDown size={16}/></button></div>
          <div className="listing-grid">
            {listings.filter((item) => !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase())).map((item) => (
              <article className="listing-card" key={item.name}>
                <div className="listing-image"><span className="badge">{item.badge}</span><button className={favorites.includes(item.name) ? 'favorite active' : 'favorite'} onClick={() => toggleFavorite(item.name)} aria-label="Favorite"><Heart size={19} fill={favorites.includes(item.name) ? 'currentColor' : 'none'} /></button><ProductVisual tone={item.tone} image={item.image} name={item.name}/></div>
                <div className="listing-info"><p className="category-label">{item.category}</p><h3>{item.name}</h3><p className="meta">{item.meta}</p><strong>{item.price}</strong></div>
              </article>
            ))}
          </div>
        </section>

        <section className="trust shell" id="how">
          <div><span className="trust-icon"><ShieldCheck /></span><div><h3>Buy with confidence</h3><p>Verified profiles and secure messages</p></div></div>
          <div><span className="trust-icon"><Zap /></span><div><h3>Simple & fast</h3><p>List an item in under two minutes</p></div></div>
          <div><span className="trust-icon"><BadgeDollarSign /></span><div><h3>Keep more of it</h3><p>Low fees and no hidden surprises</p></div></div>
        </section>

        <section className="sell-banner shell">
          <div><p className="section-kicker">Declutter, upgrade, repeat</p><h2>Turn what you don't need<br/>into something new.</h2></div>
          <button onClick={() => setSellOpen(true)}>Start selling <ArrowRight size={18}/></button>
        </section>
      </main>

      {sellOpen && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSellOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true">
            <button className="modal-close" onClick={() => setSellOpen(false)}><X /></button>
            <p className="section-kicker">Create a listing</p><h2>What are you selling?</h2>
            <div className="sell-categories">{categories.map(({ name, icon: Icon }) => <button key={name}><Icon/><span>{name}</span></button>)}</div>
            <button className="continue-button" onClick={() => setSellOpen(false)}>Continue <ArrowRight size={18}/></button>
          </div>
        </div>
      )}

      <footer><div className="shell"><a className="brand" href="#"><span className="brand-mark">R</span><span>ReMarket</span></a><p>Good finds, fresh starts.</p><span>© 2026 ReMarket</span></div></footer>
    </>
  )
}
