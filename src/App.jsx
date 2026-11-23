import { useEffect, useRef, useState } from 'react'
import {
  motion, AnimatePresence, LayoutGroup, MotionConfig, animate,
  useScroll, useSpring, useTransform, useMotionValue, useMotionValueEvent, useInView,
} from 'motion/react'
import {
  Search, Heart, Menu, X, Plus, ArrowRight, ArrowLeft, Car, Smartphone, Shirt, Laptop,
  ShieldCheck, Zap, BadgeDollarSign, MessageCircle, MapPin, Check, Sparkles,
} from 'lucide-react'

const ease = [0.22, 1, 0.36, 1]
const spring = { type: 'spring', stiffness: 420, damping: 34 }
const soft = { type: 'spring', stiffness: 230, damping: 28 }

const categories = [
  { name: 'Cars', count: 3240, icon: Car, tone: 'car', glow: '#3ddc97' },
  { name: 'Phones', count: 8192, icon: Smartphone, tone: 'phone', glow: '#8b7bff' },
  { name: 'Clothes', count: 12408, icon: Shirt, tone: 'cloth', glow: '#5cc8ff' },
  { name: 'Computers', count: 2981, icon: Laptop, tone: 'computer', glow: '#ff9f7a' },
]
const toneFor = Object.fromEntries(categories.map((c) => [c.name, c.tone]))

const IPHONE_IMG = 'https://www.istore.com.gh/images/iphonehome/iphone15pro/iphone_15_pro_white_titanium.jpg'

const initialListings = [
  { id: 'range-rover', name: '2021 Range Rover Sport', category: 'Cars', price: '$32,800', meta: '18k miles · Automatic', tone: 'car', badge: 'Great price', image: 'https://media.cdn-jaguarlandrover.com/api/v2/images/121525/w/640/h/360.jpg' },
  { id: 'iphone-15', name: 'iPhone 15 Pro, 256GB', category: 'Phones', price: '$749', meta: 'Excellent · 1 year old', tone: 'phone', badge: 'Verified', image: IPHONE_IMG },
  { id: 'linen-set', name: 'Linen summer set', category: 'Clothes', price: '$48', meta: 'Size M · Like new', tone: 'cloth', badge: 'Popular' },
  { id: 'macbook-air', name: 'MacBook Air M2', category: 'Computers', price: '$899', meta: '16GB · 512GB · 2023', tone: 'computer', badge: 'Top deal', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=85' },
]

const emoji = { car: '🚙', phone: '📱', cloth: '👕', computer: '💻' }
const navLinks = [['#browse', 'Browse'], ['#categories', 'Categories'], ['#how', 'How it works']]
const marqueeItems = ['Cars', 'Phones', 'Clothes', 'Computers', 'Verified sellers', 'Secure chat', 'Low fees', 'List in 2 minutes']

function ProductVisual({ item }) {
  return (
    <div className={`product-visual ${item.tone}`}>
      {item.image ? <img src={item.image} alt={item.name} draggable={false} /> : <span>{emoji[item.tone]}</span>}
    </div>
  )
}

function Reveal({ children, className, delay = 0, x = 0, y = 36 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

function CountUp({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.6, ease,
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() },
    })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>0</span>
}

function Nav({ favCount, sellFrom, openSell }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))

  return (
    <motion.header className="nav-wrap" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...soft, delay: 0.1 }}>
      <motion.nav layout transition={soft} className={`nav glass ${scrolled ? 'scrolled' : ''}`} style={{ borderRadius: 999 }}>
        <button className="menu-button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={menuOpen ? 'x' : 'm'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} style={{ display: 'grid' }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
        <motion.a layout="position" className="brand" href="#top"><span className="brand-mark">R</span><span>ReMarket</span></motion.a>
        <div className="nav-links" onMouseLeave={() => setHovered(null)}>
          {navLinks.map(([href, label]) => (
            <a key={href} href={href} onMouseEnter={() => setHovered(href)}>
              {hovered === href && <motion.span layoutId="nav-hover" className="nav-hover" transition={spring} />}
              <span>{label}</span>
            </a>
          ))}
        </div>
        <motion.div layout="position" className="nav-actions">
          <a className="glass-btn icon-button" href="#browse" aria-label={`Favorites (${favCount})`}>
            <Heart size={18} />
            {favCount > 0 && (
              <motion.span key={favCount} className="count" initial={{ scale: 1.8 }} animate={{ scale: 1 }} transition={spring}>{favCount}</motion.span>
            )}
          </a>
          {sellFrom === 'nav' ? <span className="sell-placeholder" /> : (
            <motion.button layoutId="sell-nav" className="glass-btn tint sell-button" style={{ borderRadius: 999 }} whileTap={{ scale: 0.94 }} onClick={() => openSell('nav')}>
              <motion.span layout="position" className="sell-label"><Plus size={17} /><span className="label-text">Sell item</span></motion.span>
            </motion.button>
          )}
        </motion.div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu glass" style={{ transformOrigin: 'top center' }}
            initial={{ opacity: 0, y: -14, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.97 }} transition={soft}>
            {navLinks.map(([href, label], i) => (
              <motion.a key={href} href={href} onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ ...soft, delay: 0.05 + i * 0.05 }}>
                {label}<ArrowRight size={16} />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function Hero({ search, setSearch, onSubmit }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 70, damping: 18 })
  const sy = useSpring(my, { stiffness: 70, damping: 18 })
  const backX = useTransform(sx, (v) => v * -26)
  const backY = useTransform(sy, (v) => v * -26)
  const midX = useTransform(sx, (v) => v * 34)
  const midY = useTransform(sy, (v) => v * 34)
  const frontX = useTransform(sx, (v) => v * 70)
  const frontY = useTransform(sy, (v) => v * 70)
  const rotY = useTransform(sx, (v) => v * 20)
  const rotX = useTransform(sy, (v) => v * -16)
  const { scrollY } = useScroll()
  const artY = useTransform(scrollY, [0, 700], [0, 140])

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const lines = [['Find', 'a', 'good', 'deal.'], ['Make', 'a', 'fresh', 'start.']]

  return (
    <section className="hero shell" id="top" onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0) }}>
      <div className="hero-copy">
        <motion.p className="eyebrow glass" initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...soft, delay: 0.2 }}>
          <Sparkles size={14} /> Your local marketplace
        </motion.p>
        <h1>
          {lines.map((line, li) => (
            <span key={li} className={`line ${li === 1 ? 'accent' : ''}`}>
              {line.map((w, wi) => (
                <span className="word-mask" key={wi}>
                  <motion.span className="word" initial={{ y: '115%', rotate: 8 }} animate={{ y: '0%', rotate: 0 }}
                    transition={{ duration: 1, ease, delay: 0.3 + (li * 4 + wi) * 0.06 }}>{w}</motion.span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.85 }}>
          Buy and sell quality finds in your community — from everyday essentials to dream rides.
        </motion.p>
        <motion.form className="search glass" onSubmit={(e) => { e.preventDefault(); onSubmit() }}
          initial={{ opacity: 0, y: 30, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...soft, delay: 1 }}>
          <Search size={20} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="What are you looking for?" aria-label="Search listings" />
          <motion.button type="submit" className="glass-btn tint" whileTap={{ scale: 0.94 }}>Search</motion.button>
        </motion.form>
        <motion.div className="hero-chips" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 1.15 } } }}>
          <span>Popular:</span>
          {['iPhone', 'MacBook', 'Range Rover'].map((t) => (
            <motion.button key={t} variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0, transition: soft } }}
              onClick={() => { setSearch(t); onSubmit() }}>{t}</motion.button>
          ))}
        </motion.div>
      </div>

      <motion.div className="hero-art" aria-hidden="true" style={{ y: artY }}>
        <motion.div className="layer" style={{ x: backX, y: backY }}>
          <motion.div className="orb" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.6, ease, delay: 0.2 }} />
          <div className="ring" />
        </motion.div>
        <motion.div className="layer" style={{ x: midX, y: midY }}>
          <motion.div className="device glass" style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
            initial={{ opacity: 0, y: 90, rotateZ: -14, scale: 0.85 }} animate={{ opacity: 1, y: 0, rotateZ: -5, scale: 1 }} transition={{ ...soft, delay: 0.5 }}>
            <img src={IPHONE_IMG} alt="" draggable={false} />
            <div className="device-tag glass">
              <div><small>iPhone 15 Pro</small><strong>$749</strong></div>
              <span className="verified"><Check size={12} strokeWidth={3} /> Verified</span>
            </div>
          </motion.div>
        </motion.div>
        <motion.div className="layer" style={{ x: frontX, y: frontY }}>
          <motion.div className="float-pos f1" initial={{ opacity: 0, x: -90, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ ...soft, delay: 0.95 }}>
            <div className="float glass"><span className="emoji">👟</span><div><small>Fresh find</small><strong>$42</strong></div></div>
          </motion.div>
          <motion.div className="float-pos f2" initial={{ opacity: 0, x: 90, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ ...soft, delay: 1.1 }}>
            <div className="float glass"><span className="emoji">🚲</span><div><small>Near you</small><strong>$180</strong></div></div>
          </motion.div>
          <motion.div className="float-pos f3" initial={{ opacity: 0, y: -40, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...soft, delay: 1.25 }}>
            <div className="float glass mini"><Heart size={15} fill="currentColor" /> 128 saved today</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

const slide = {
  enter: (d) => ({ x: d * 70, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d * -70, opacity: 0 }),
}

function SellSheet({ from, onClose, onPublish, onView }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [cat, setCat] = useState(null)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const go = (s) => { setDir(s > step ? 1 : -1); setStep(s) }
  const valid = title.trim() && Number(price) > 0

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    onPublish({
      id: `new-${Date.now()}`, name: title.trim(), category: cat,
      price: `$${Number(price).toLocaleString()}`, meta: 'Just listed · Near you', tone: toneFor[cat], badge: 'New',
    })
    go(2)
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div layout layoutId={`sell-${from}`} className="sheet glass strong" style={{ borderRadius: 32 }} transition={soft} role="dialog" aria-modal="true" aria-label="Create a listing">
        <motion.div layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>
          <button className="glass-btn close-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
          <div className="step-dots">
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="step-dot" animate={{ width: i === step ? 28 : 8, opacity: i <= step ? 1 : 0.3 }} transition={spring} />
            ))}
          </div>
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={soft}>
              {step === 0 && (
                <>
                  <p className="kicker">Create a listing</p>
                  <h2>What are you selling?</h2>
                  <LayoutGroup id="pick">
                    <div className="pick-grid">
                      {categories.map(({ name, icon: Icon }) => (
                        <button key={name} className={`pick ${cat === name ? 'selected' : ''}`} onClick={() => setCat(name)}>
                          {cat === name && <motion.span layoutId="pick-active" className="pick-active" transition={spring} />}
                          <Icon size={22} /><span>{name}</span>
                        </button>
                      ))}
                    </div>
                  </LayoutGroup>
                  <div className="sheet-actions">
                    <motion.button className="glass-btn tint" disabled={!cat} whileTap={{ scale: 0.96 }} onClick={() => go(1)}>Continue <ArrowRight size={18} /></motion.button>
                  </div>
                </>
              )}
              {step === 1 && (
                <form onSubmit={submit}>
                  <p className="kicker">{cat}</p>
                  <h2>Tell buyers about it</h2>
                  <label className="field"><span>Title</span><input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`e.g. ${initialListings.find((l) => l.category === cat)?.name}`} /></label>
                  <label className="field"><span>Price (USD)</span><input type="number" min="1" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" /></label>
                  <div className="sheet-actions">
                    <motion.button type="button" className="glass-btn" whileTap={{ scale: 0.96 }} onClick={() => go(0)}><ArrowLeft size={18} /> Back</motion.button>
                    <motion.button type="submit" className="glass-btn tint" disabled={!valid} whileTap={{ scale: 0.96 }}>Publish <Sparkles size={16} /></motion.button>
                  </div>
                </form>
              )}
              {step === 2 && (
                <div className="success">
                  <motion.div className="success-ring" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...spring, delay: 0.1 }}>
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.5, ease }} />
                    </svg>
                  </motion.div>
                  <h2>Your listing is live</h2>
                  <p className="muted">“{title}” is now at the top of Fresh listings.</p>
                  <div className="sheet-actions">
                    <motion.button className="glass-btn tint" whileTap={{ scale: 0.96 }} onClick={onView}>View listing <ArrowRight size={18} /></motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}

function Detail({ item, fav, onFav, onClose }) {
  const [sent, setSent] = useState(false)
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div layoutId={`card-${item.id}`} className="detail glass strong" style={{ borderRadius: 32 }} transition={soft} role="dialog" aria-modal="true" aria-label={item.name}>
        <motion.div layoutId={`img-${item.id}`} className="detail-image" style={{ borderRadius: 24 }} transition={soft}>
          <ProductVisual item={item} />
        </motion.div>
        <motion.div className="detail-body" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0, transition: { ...soft, delay: 0.15 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
          <button className="glass-btn close-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
          <p className="kicker">{item.category}</p>
          <h2>{item.name}</h2>
          <div className="detail-meta">
            <span className="chip">{item.badge}</span>
            <span className="chip"><MapPin size={12} /> Near you</span>
          </div>
          <div className="detail-price">{item.price}</div>
          <p className="muted">{item.meta}</p>
          <p className="detail-desc">Listed by a verified seller in your area. Send a message to ask questions or arrange a viewing — payments stay protected until you confirm.</p>
          <div className="detail-actions">
            <motion.button className="glass-btn tint" whileTap={{ scale: 0.96 }} onClick={() => setSent(true)}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={sent ? 's' : 'm'} className="btn-inner" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {sent ? <><Check size={18} /> Request sent</> : <><MessageCircle size={18} /> Message seller</>}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            <motion.button className={`glass-btn heart-btn ${fav ? 'active' : ''}`} whileTap={{ scale: 0.88 }} onClick={onFav} aria-label="Save">
              <motion.span animate={fav ? { scale: [1, 1.45, 1] } : { scale: 1 }} transition={{ duration: 0.4 }} style={{ display: 'grid' }}>
                <Heart size={19} fill={fav ? 'currentColor' : 'none'} />
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function App() {
  const [listings, setListings] = useState(initialListings)
  const [favorites, setFavorites] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)
  const [sellFrom, setSellFrom] = useState(null)
  const gridRef = useRef(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' })
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  useEffect(() => {
    const open = active || sellFrom
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') { setActive(null); setSellFrom(null) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, sellFrom])

  const toggleFavorite = (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  const goBrowse = () => document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })
  const pickCategory = (name) => { setFilter(name); setSearch(''); goBrowse() }
  const q = search.trim().toLowerCase()
  const visible = listings.filter((i) =>
    (filter === 'All' || i.category === filter) &&
    (!q || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)))

  return (
    <MotionConfig reducedMotion="user">
      <div className="aurora" aria-hidden="true"><i /><i /><i /><i /></div>
      <motion.div className="progress" style={{ scaleX: progress }} />

      <Nav favCount={favorites.length} sellFrom={sellFrom} openSell={setSellFrom} />

      <main>
        <Hero search={search} setSearch={setSearch} onSubmit={() => { setFilter('All'); goBrowse() }} />

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>

        <section className="categories shell" id="categories">
          <Reveal className="section-heading">
            <div><p className="kicker">Explore</p><h2>Browse by <em>category</em></h2></div>
            <a className="glass-btn" href="#browse" onClick={() => setFilter('All')}>View all <ArrowRight size={16} /></a>
          </Reveal>
          <motion.div className="category-grid" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            variants={{ show: { transition: { staggerChildren: 0.09 } } }}>
            {categories.map(({ name, count, icon: Icon, glow }) => (
              <motion.button key={name} className="category-card glass" style={{ '--glow': glow }} whileTap={{ scale: 0.97 }}
                variants={{ hidden: { opacity: 0, y: 50, scale: 0.92 }, show: { opacity: 1, y: 0, scale: 1, transition: soft } }}
                onClick={() => pickCategory(name)}>
                <span className="category-glow" />
                <span className="category-icon"><Icon size={24} /></span>
                <div><h3>{name}</h3><p><CountUp to={count} /> listings</p></div>
                <ArrowRight className="category-arrow" size={20} />
              </motion.button>
            ))}
          </motion.div>
        </section>

        <section className="featured shell" id="browse">
          <Reveal className="section-heading">
            <div><p className="kicker">Just for you</p><h2>Fresh <em>listings</em></h2></div>
            <LayoutGroup id="segmented">
              <div className="segmented glass" role="tablist">
                {['All', ...categories.map((c) => c.name)].map((name) => (
                  <button key={name} role="tab" aria-selected={filter === name} className={filter === name ? 'active' : ''} onClick={() => setFilter(name)}>
                    {filter === name && <motion.span layoutId="seg-pill" className="seg-pill" transition={spring} />}
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </Reveal>

          <AnimatePresence>
            {q && (
              <motion.div className="search-note" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <span>Results for “{search}”</span>
                <button onClick={() => setSearch('')}><X size={14} /> Clear</button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout className="listing-grid" ref={gridRef}>
            <AnimatePresence mode="popLayout">
              {visible.map((item, i) => {
                const fav = favorites.includes(item.id)
                return (
                  <motion.article key={item.id} layoutId={`card-${item.id}`} className="listing-card glass" style={{ borderRadius: 26 }}
                    tabIndex={0} role="button" aria-label={`${item.name}, ${item.price}`}
                    onClick={() => setActive(item)} onKeyDown={(e) => e.key === 'Enter' && setActive(item)}
                    initial={{ opacity: 0, y: 40, scale: 0.94 }}
                    animate={gridInView ? { opacity: 1, y: 0, scale: 1 } : undefined}
                    exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                    transition={{ layout: soft, default: { ...soft, delay: i * 0.06 } }}>
                    <motion.div layoutId={`img-${item.id}`} className="listing-image" style={{ borderRadius: 20 }} transition={soft}>
                      <ProductVisual item={item} />
                    </motion.div>
                    <span className="badge glass">{item.badge}</span>
                    <motion.button className={`glass-btn favorite ${fav ? 'active' : ''}`} whileTap={{ scale: 0.8 }} aria-label="Favorite"
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id) }}>
                      <motion.span animate={fav ? { scale: [1, 1.5, 1] } : { scale: 1 }} transition={{ duration: 0.4 }} style={{ display: 'grid' }}>
                        <Heart size={17} fill={fav ? 'currentColor' : 'none'} />
                      </motion.span>
                    </motion.button>
                    <div className="listing-info">
                      <p className="category-label">{item.category}</p>
                      <h3>{item.name}</h3>
                      <p className="meta">{item.meta}</p>
                      <div className="price-row"><strong>{item.price}</strong><span className="view-chip">View <ArrowRight size={14} /></span></div>
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </motion.div>
          <AnimatePresence>
            {visible.length === 0 && (
              <motion.div className="empty glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p>Nothing matches yet.</p>
                <button className="glass-btn" onClick={() => { setSearch(''); setFilter('All') }}>Clear filters</button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="trust shell" id="how">
          {[
            [ShieldCheck, 'Buy with confidence', 'Verified profiles and secure messages'],
            [Zap, 'Simple & fast', 'List an item in under two minutes'],
            [BadgeDollarSign, 'Keep more of it', 'Low fees and no hidden surprises'],
          ].map(([Icon, title, text], i) => (
            <Reveal key={title} delay={i * 0.1} x={-40} y={0}>
              <div className="trust-card glass">
                <span className="trust-icon"><Icon size={22} /></span>
                <h3>{title}</h3><p>{text}</p>
              </div>
            </Reveal>
          ))}
        </section>

        <Reveal className="shell">
          <section className="banner glass">
            <span className="banner-glow" />
            <div><p className="kicker">Declutter, upgrade, repeat</p><h2>Turn what you don't need<br />into something <em>new.</em></h2></div>
            {sellFrom === 'banner' ? <span className="sell-placeholder big" /> : (
              <motion.button layoutId="sell-banner" className="glass-btn tint" style={{ borderRadius: 999 }} whileTap={{ scale: 0.95 }} onClick={() => setSellFrom('banner')}>
                <motion.span layout="position" className="btn-inner">Start selling <ArrowRight size={18} /></motion.span>
              </motion.button>
            )}
          </section>
        </Reveal>
      </main>

      <footer>
        <div className="shell">
          <a className="brand" href="#top"><span className="brand-mark">R</span><span>ReMarket</span></a>
          <p>Good finds, fresh starts.</p>
          <span>© 2026 ReMarket</span>
        </div>
      </footer>

      <AnimatePresence>
        {(active || sellFrom) && (
          <motion.div key="backdrop" className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <Detail key="detail" item={active} fav={favorites.includes(active.id)} onFav={() => toggleFavorite(active.id)} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {sellFrom && (
          <SellSheet key="sell" from={sellFrom} onClose={() => setSellFrom(null)}
            onPublish={(item) => { setListings((l) => [item, ...l]); setFilter('All'); setSearch('') }}
            onView={() => { setSellFrom(null); setTimeout(goBrowse, 350) }} />
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}
