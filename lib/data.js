export const img = (file) => `/assest/Menu Highlights/${file}`;

export const NAV_LINKS = [
  { href: "#home", label: "Home", drawer: "Home" },
  { href: "#about", label: "Our Story", drawer: "Our Story" },
  { href: "#menu", label: "Signature Menu", drawer: "Signature Menu" },
  { href: "#pricing", label: "Price Index", drawer: "Price Index" },
  { href: "#box-builder", label: "Custom Box 🎁", drawer: "Build Custom Box 🎁" },
  { href: "#how-to-order", label: "How to Order", drawer: "How to Pre-Order" },
  { href: "#reviews", label: "Reviews", drawer: "Reviews" },
  { href: "#gallery", label: "Gallery", drawer: "Creations Gallery" },
  { href: "#contact", label: "Contact", drawer: "Contact Us" },
];

export const TRUST = [
  { icon: "fa-seedling", title: "100% Vegetarian Friendly", text: "Eggless artisanal brownies & treats baked on request." },
  { icon: "fa-fire-burner", title: "Baked Fresh to Order", text: "Never stored or frozen. Whipped & baked just for you." },
  { icon: "fa-gem", title: "Gourmet Ingredients", text: "Real cocoa, rich hazelnut Nutella, and pure dairy butter." },
  { icon: "fa-box-open", title: "Luxury Gift Packaging", text: "Elegant ribboned boxes ready for gifting & celebrations." },
];

export const MARQUEE = [
  { file: "The Best Brownies Ever.jpeg", title: "The Best Brownies Ever", name: "Signature Fudgy Brownies", desc: "Signature crackly top with deeply fudgy dark chocolate center." },
  { file: "Soft and Gooey Nutella Brownies - Strawberry in the Desert.jpeg", title: "Nutella Brownies", name: "Molten Nutella Swirl", desc: "Generously swirled with molten Nutella hazelnut spread." },
  { file: "Bombshell Oreo Brownies.jpeg", title: "Bombshell Oreo Brownies", name: "Bombshell Oreo", desc: "Fudgy brownie base packed with crunchy Oreo cookie chunks." },
  { file: "Tin Can Chocolate Dream Cake Filipino Recipe.jpeg", title: "Tin Can Chocolate Dream Cake", name: "Chocolate Dream Cake", desc: "5 luxurious layers of chocolate sponge, gooey fudge, and crispy shell." },
  { file: "Haole Brownies AKA Blonde Brownies.jpeg", title: "Haole Blonde Brownies", name: "Buttery Golden Blondies", desc: "Golden brown-sugar blondies with toasted nuts & butterscotch sweetness." },
  { file: "12 Amazing Brownies That Will Make You Drool.jpeg", title: "12 Amazing Brownies Sampler Box", name: "12-Piece Sampler Box", desc: "12 handpicked brownie varieties in one ultimate gifting box." },
  { file: "Red Velvet Cake.jpeg", title: "Red Velvet Cake", name: "Classic Red Velvet", desc: "Velvety crimson sponge layered with luscious cream cheese frosting." },
  { file: "Ultimate Triple Layer Brownies Recipe.jpeg", title: "Triple Layer Brownies", name: "Triple Layer Brownies", desc: "Three decadent layers of white, milk, and dark chocolate." },
];

export const ABOUT_FEATURES = [
  { icon: "fa-check-circle", title: "Small Batch Mastery", text: "Hand-stirred and temperature-controlled for consistent fudgy perfection." },
  { icon: "fa-star", title: "Zero Shortcuts", text: "Pure dairy butter, rich Dutch-processed cocoa, and real Belgian chocolate." },
  { icon: "fa-gift", title: "Celebration Ready", text: "Tailored sampler boxes and personalized note cards for birthdays and milestones." },
  { icon: "fa-heart", title: "Warm Personal Touch", text: "Direct communication with the baker to match your sweetness preferences." },
];

export const FILTERS = [
  { key: "all", icon: "fa-border-all", label: "All Treats" },
  { key: "brownies", icon: "fa-cookie-bite", label: "Fudgy Brownies" },
  { key: "blondies", icon: "fa-bread-slice", label: "Blonde Brownies" },
  { key: "cakes", icon: "fa-birthday-cake", label: "Dream Cakes & Slices" },
  { key: "sampler", icon: "fa-boxes-stacked", label: "Tasting Boxes" },
];

const half = (price) => ({ tab: `Half (₹${price})`, label: "Half Box (6 pcs)", price });
const full = (price) => ({ tab: `Full (₹${price})`, label: "Full Box (12 pcs)", price });

export const PRODUCTS = [
  {
    id: "sampler", name: "12 Amazing Brownies Sampler Box", title: "12 Amazing Brownies",
    categories: ["sampler", "brownies"], tag: "Signature Box",
    image: "12 Amazing Brownies That Will Make You Drool.jpeg",
    desc: "The ultimate tasting sampler featuring 12 decadent, assorted brownie squares. Ideal for gifting, family gatherings, or treating yourself to every signature flavor.",
    portions: [{ tab: "Assorted Gift Box (12 pcs)", label: "Full Box (12 pcs)", price: 999 }],
  },
  {
    id: "classic", name: "Normal Brownie (Classic Fudgy)", title: "Classic Fudgy Brownies",
    categories: ["brownies"], tag: "Bestseller", image: "The Best Brownies Ever.jpeg",
    desc: "Our hallmark brownie: intense dark chocolate flavor with an authentic paper-thin crinkle top and dense, ultra-fudgy center that melts in your mouth.",
    portions: [half(499), full(999)],
  },
  {
    id: "nutella", name: "Nutella Brownies", title: "Nutella Brownies",
    categories: ["brownies"], tag: "Most Loved",
    image: "Soft and Gooey Nutella Brownies - Strawberry in the Desert.jpeg",
    desc: "Fudgy cocoa batter heavily swirled with molten Nutella hazelnut cream. Warm it up for 15 seconds to unleash the warm, gooey chocolate-hazelnut bliss.",
    portions: [half(639), full(1279)],
  },
  {
    id: "triple", name: "Triple Chocolate Brownies", title: "Triple Chocolate Brownies",
    categories: ["brownies"], tag: "3 Decadent Tiers", image: "Ultimate Triple Layer Brownies Recipe.jpeg",
    desc: "Three luxurious tiers of chocolate perfection: deep dark fudge base, silky milk chocolate ganache layer, and creamy white chocolate swirl.",
    portions: [half(649), full(1299)],
  },
  {
    id: "oreo", name: "Bombshell Oreo Brownies", title: "Bombshell Oreo Brownies",
    categories: ["brownies"], tag: "Cookie Crunch", image: "Bombshell Oreo Brownies.jpeg",
    desc: "Loaded with chunky crunchy Oreo biscuits baked directly inside the fudgy batter, crowned with extra cookie pieces and white chocolate drizzle.",
    portions: [half(549), full(1099)],
  },
  {
    id: "blonde", name: "Blonde Brownies (Haole)", title: "Blonde Brownies (Haole)",
    categories: ["blondies"], tag: "Caramel Notes", image: "Haole Brownies AKA Blonde Brownies.jpeg",
    desc: "Rich browned butter and molasses brown sugar base delivering notes of warm butterscotch, vanilla, and toasted nuts with a chewy texture.",
    portions: [half(549), full(1099)],
  },
  {
    id: "tincan", name: "Tin Can Chocolate Dream Cake", title: "Tin Can Dream Cake",
    categories: ["cakes"], tag: "Viral Sensation", image: "Tin Can Chocolate Dream Cake Filipino Recipe.jpeg",
    desc: "5 layers of pure bliss: moist chocolate cake, silky chocolate cream, gooey fudge, a crisp chocolate crack shell, and cocoa dusting.",
    portions: [{ tab: "Signature 500g Luxury Tin", label: "500g Luxury Tin", price: 699 }],
  },
  {
    id: "redvelvet", name: "Red Velvet Cake", title: "Red Velvet Cake",
    categories: ["cakes"], tag: "Cream Cheese", image: "Red Velvet Cake.jpeg",
    desc: "Traditional buttermilk red velvet crumb with cocoa undertones, frosted with authentic tangy cream cheese frosting. Elegant & regal.",
    portions: [
      { tab: "Half Kg (₹650)", label: "Half Kg (500g)", price: 650 },
      { tab: "1 Kg (₹1200)", label: "1 Kg Full", price: 1200 },
    ],
  },
  {
    id: "whiteforest", name: "White Forest Cake", title: "White Forest Gateau",
    categories: ["cakes"], tag: "Light & Elegant", image: "White Forest Cake.jpeg",
    desc: "Fluffy vanilla sponge layered with pure dairy cream, tart imported cherries, and enveloped in delicate Belgian white chocolate curls.",
    portions: [
      { tab: "Half Kg (₹600)", label: "Half Kg (500g)", price: 600 },
      { tab: "1 Kg (₹1100)", label: "1 Kg Full", price: 1100 },
    ],
  },
];

export const PRICE_ROWS = [
  { item: "Normal Brownie", badge: "Signature", half: "₹499 (6 pcs)", full: "₹999 (12 pcs)", msg: "Normal Brownies" },
  { item: "Triple Chocolate Brownies", badge: "Ultra Rich", half: "₹649 (6 pcs)", full: "₹1,299 (12 pcs)", msg: "Triple Chocolate Brownies" },
  { item: "Blonde Brownies", badge: "Caramel", half: "₹549 (6 pcs)", full: "₹1,099 (12 pcs)", msg: "Blonde Brownies" },
  { item: "Triple Chocolate Blondies", half: "₹699 (6 pcs)", full: "₹1,399 (12 pcs)", msg: "Triple Chocolate Blondies" },
  { item: "Fruits & Nuts Brownie", badge: "Crunch", half: "₹599 (6 pcs)", full: "₹1,199 (12 pcs)", msg: "Fruits and Nuts Brownies" },
  { item: "Nutella Brownies", badge: "Molten", half: "₹639 (6 pcs)", full: "₹1,279 (12 pcs)", msg: "Nutella Brownies" },
  { item: "Bombshell Oreo Brownies", half: "₹549 (6 pcs)", full: "₹1,099 (12 pcs)", msg: "Bombshell Oreo Brownies" },
  { item: "12 Amazing Brownies Sampler Box", single: "₹999 / Complete 12-Piece Assorted Gift Box", msg: "the 12 Brownies Sampler Box" },
  { item: "Tin Can Chocolate Dream Cake", single: "₹699 / 500g Signature Luxury Tin", msg: "the Tin Can Chocolate Dream Cake" },
];

export const BOX_SIZES = [
  { size: 6, price: 549, title: "Half Box (6 Brownies)", text: "Perfect for personal indulgence or intimate sweet cravings." },
  { size: 12, price: 1049, title: "Full Gift Box (12 Brownies)", text: "Great for celebrations, gifting, or sharing with family." },
];

export const FLAVORS = [
  { name: "Classic Fudgy", note: "Dark chocolate & crinkle top" },
  { name: "Nutella Swirl", note: "Molten hazelnut spread" },
  { name: "Bombshell Oreo", note: "Crunchy Oreo chunks" },
  { name: "Triple Chocolate", note: "Dark, milk & white layers" },
  { name: "Golden Blondie", note: "Brown sugar & butterscotch" },
  { name: "Fruits & Nuts", note: "Toasted almonds, cashews & berries" },
];

export const STEPS = [
  { n: "01", icon: "fas fa-hand-pointer", title: "Select & Customize", text: "Browse our menu or use our interactive Box Builder to assemble your dream selection of brownies, blondies, or cakes." },
  { n: "02", icon: "fab fa-whatsapp", title: "WhatsApp Confirmation", text: "Send your selection with your desired delivery or pickup date (24 to 48 hours notice recommended). We'll confirm slot availability." },
  { n: "03", icon: "fas fa-box", title: "Freshly Baked & Handed", text: "Your order is whipped, baked, cooled, and packaged in our signature luxury presentation box ready for you to savor." },
];

export const FAQS = [
  { q: "How do I get the ultra-gooey molten center?", a: "Warm your brownie slice in the microwave for 12–15 seconds (not longer). The chocolate chunks and Nutella swirls will liquefy into pure molten decadence. Pair with a cold scoop of vanilla ice cream!" },
  { q: "What is the shelf life and storage recommendation?", a: "Our brownies stay moist at room temperature in an airtight container for 4–5 days. In the refrigerator, they remain delicious for up to 2 weeks. You can also freeze brownie slabs for up to 1 month!" },
  { q: "Can I order 100% vegetarian / eggless versions?", a: "Yes, absolutely! We take great pride in our tested eggless recipes that achieve identical fudginess, crinkle tops, and rich flavor without eggs. Simply mention \"100% Eggless\" when placing your order." },
  { q: "Do you provide gifting hampers & custom messages?", a: "Yes! Every box comes packaged with artisanal care. We provide complimentary handwritten personalized gift cards for birthdays, anniversaries, corporate gifts, and festive hampers upon request." },
];

export const REVIEWS = [
  { initials: "AR", name: "Ayesha Rahman", sub: "Verified Pre-Order Customer", quote: "The Nutella Brownies from Shafa's Dessert House are honestly unmatched! The crackly crinkle top with the molten center when heated for 10 seconds is heavenly. My family finished the box in an hour." },
  { initials: "MK", name: "Mohammed Khalid", sub: "Celebration Gift Order", quote: "I ordered the 12 Brownies Sampler Box for my sister's birthday gift. The packaging was so luxurious with ribbons and a handwritten card. Every single flavor felt distinct and high-end." },
  { initials: "PS", name: "Priya S.", sub: "Chocolate Dream Cake Lover", quote: "The Tin Can Chocolate Dream Cake is out of this world. Breaking that crisp top shell into the cold chocolate mousse and moist sponge underneath was pure satisfaction. Highly recommended!" },
];

export const GALLERY = [
  { file: "The Best Brownies Ever.jpeg", title: "The Best Brownies Ever", tile: "Classic Fudgy Slabs", desc: "Pure dark chocolate with crinkled top perfection." },
  { file: "Bombshell Oreo Brownies.jpeg", title: "Bombshell Oreo Brownies", tile: "Bombshell Oreo", desc: "Chunky crunchy Oreo cookies baked inside fudgy cocoa batter." },
  { file: "Haole Brownies AKA Blonde Brownies.jpeg", title: "Haole Blonde Brownies", tile: "Golden Butter Blondies", desc: "Brown butter, caramel notes, and toasted nuts." },
  { file: "Red Velvet Cake.jpeg", title: "Red Velvet Cake", tile: "Red Velvet Gateau", desc: "Velvety crimson sponge paired with tangy cream cheese frosting." },
  { file: "Soft and Gooey Nutella Brownies - Strawberry in the Desert.jpeg", title: "Soft and Gooey Nutella Brownies", tile: "Nutella Swirl Slabs", desc: "Rich hazelnut Nutella swirl melted to perfection." },
  { file: "Tin Can Chocolate Dream Cake Filipino Recipe.jpeg", title: "Tin Can Chocolate Dream Cake", tile: "Tin Can Dream Cake", desc: "5 exquisite layers of pure chocolate decadence." },
  { file: "Ultimate Triple Layer Brownies Recipe.jpeg", title: "Ultimate Triple Layer Brownies", tile: "Triple Chocolate Slab", desc: "Dark, milk, and white chocolate layered into perfection." },
  { file: "White Forest Cake.jpeg", title: "White Forest Cake", tile: "White Forest Gateau", desc: "White chocolate shavings with whipped cream and cherries." },
];
