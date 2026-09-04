const products = [
  {id:1,name:"Luxe Armchair",brand:"Innova Home",category:"Furniture",price:499,image:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=85",desc:"A perfect blend of comfort and style with a solid wood frame.",badge:"Featured"},
  {id:2,name:"Modern Pendant Light",brand:"Luma",category:"Lighting",price:129,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85",desc:"Sculptural pendant lighting for a warm, modern atmosphere.",badge:"New"},
  {id:3,name:"Wooden Dining Table",brand:"Oak & Co.",category:"Furniture",price:799,image:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=85",desc:"Solid oak dining table with clean lines and a natural finish.",badge:"New"},
  {id:4,name:"Ceramic Statement Vase",brand:"Forma",category:"Decor",price:49,image:"https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=85",desc:"Hand-finished ceramic vase designed for modern interiors.",badge:""},
  {id:5,name:"Minimal Desk Lamp",brand:"Luma",category:"Office",price:89,image:"https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=800&q=85",desc:"Compact task lighting with a soft, focused glow.",badge:"New"},
  {id:6,name:"Woven Accent Chair",brand:"Innova Home",category:"Furniture",price:329,image:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=85",desc:"Natural woven texture paired with a comfortable silhouette.",badge:""},
  {id:7,name:"Soft Linen Cushion",brand:"Atelier",category:"Accessories",price:39,image:"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=85",desc:"Textured linen cushion for an effortless layered look.",badge:""},
  {id:8,name:"Arch Floor Lamp",brand:"Luma",category:"Lighting",price:219,image:"https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=85",desc:"Elegant arched floor lamp with a refined metal finish.",badge:""},
  {id:9,name:"Round Wall Mirror",brand:"Forma",category:"Decor",price:179,image:"https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=85",desc:"A rounded mirror that visually opens up your space.",badge:""},
  {id:10,name:"Executive Office Chair",brand:"Innova Work",category:"Office",price:649,image:"https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=85",desc:"Supportive seating with premium upholstery and ergonomic comfort.",badge:""},
  {id:11,name:"Stoneware Tray",brand:"Forma",category:"Accessories",price:59,image:"https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=85",desc:"Minimal serving tray with a softly textured surface.",badge:""},
  {id:12,name:"Oak Side Table",brand:"Oak & Co.",category:"Furniture",price:199,image:"https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=85",desc:"Compact oak side table for bedrooms, lounges and reading corners.",badge:""}
];

const categories = [
  ["Furniture","24 products"],["Lighting","18 products"],["Decor","32 products"],["Office","16 products"],["Accessories","27 products"],
  ["Textiles","21 products"],["Outdoor","14 products"],["Kitchen","19 products"],["Storage","12 products"],["Gifts","30 products"]
];

const state = {category:"All", maxPrice:2000, query:"", sort:"featured", cart:[], favorites:new Set(), view:"grid"};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function renderCategories(){
  $("#categoryGrid").innerHTML = categories.map(([name,count],i)=>`
    <a href="#products" class="category" data-category="${name}">
      <div class="category-content"><strong>${name}</strong><small>${count}</small></div>
    </a>`).join("");
  $$("#categoryGrid .category").forEach(el=>el.addEventListener("click",()=>{
    const name=el.dataset.category;
    const mapped=["Furniture","Lighting","Decor","Office","Accessories"].includes(name)?name:"All";
    state.category=mapped; updateFilters(); renderProducts(); $("#products").scrollIntoView({behavior:"smooth"});
  }));
}
function getVisible(){
  let list=products.filter(p=>(state.category==="All"||p.category===state.category)&&p.price<=state.maxPrice&&(!state.query||`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(state.query)));
  if(state.sort==="price-low") list.sort((a,b)=>a.price-b.price);
  if(state.sort==="price-high") list.sort((a,b)=>b.price-a.price);
  if(state.sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}
function renderProducts(){
  const list=getVisible(), grid=$("#productGrid");
  grid.classList.toggle("list",state.view==="list");
  grid.innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-photo"><img src="${p.image}" alt="${p.name}" loading="lazy">${p.badge?`<span class="product-badge">${p.badge}</span>`:""}
        <button class="heart ${state.favorites.has(p.id)?"active":""}" data-fav="${p.id}" aria-label="Favorite">♡</button>
      </div>
      <h3>${p.name}</h3><div class="brand">${p.brand}</div>
      <p class="product-desc">${p.desc}</p>
      <div class="price-row"><span class="price">$${p.price.toFixed(2)}</span><span class="stock">In Stock</span></div>
      <div class="card-actions"><button class="btn outline details" data-id="${p.id}">View Details</button><button class="btn primary enquire" data-id="${p.id}">Enquire</button></div>
      <button class="compare">⇄ &nbsp; Add to comparison</button>
    </article>`).join("");
  $("#emptyState").style.display=list.length?"none":"block";
  $$("#productGrid .details").forEach(b=>b.onclick=()=>openProduct(+b.dataset.id));
  $$("#productGrid .enquire").forEach(b=>b.onclick=()=>addToCart(+b.dataset.id));
  $$("#productGrid .heart").forEach(b=>b.onclick=()=>{
    const id=+b.dataset.fav; state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id); renderProducts();
  });
}
function updateFilters(){
  $$(".filter-cat").forEach(b=>b.classList.toggle("active",b.dataset.category===state.category));
  $("#maxPrice").value=state.maxPrice; $("#maxValue").textContent=state.maxPrice;
}
function addToCart(id){
  const p=products.find(x=>x.id===id), existing=state.cart.find(x=>x.id===id);
  if(existing) existing.qty++; else state.cart.push({id,qty:1});
  renderCart(); openCart(); toast(`${p.name} added to your enquiry list`);
}
function renderCart(){
  const total=state.cart.reduce((s,x)=>s+x.qty,0); $("#cartCount").textContent=total; $("#cartTotal").textContent=total;
  $("#cartItems").innerHTML=state.cart.length?state.cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-row"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><small>${p.brand} · Qty ${x.qty}</small></div><button class="remove" data-remove="${p.id}">×</button></div>`}).join(""):`<p class="muted">Your enquiry list is empty.</p>`;
  $$(".remove").forEach(b=>b.onclick=()=>{state.cart=state.cart.filter(x=>x.id!==+b.dataset.remove);renderCart()});
}
function openCart(){ $("#overlay").classList.add("show"); $("#cartDrawer").classList.add("open") }
function closeAll(){ $("#overlay").classList.remove("show"); $("#cartDrawer").classList.remove("open"); $("#productModal").classList.remove("open") }
function openProduct(id){
  const p=products.find(x=>x.id===id);
  $("#modalContent").innerHTML=`<div class="modal-product"><img src="${p.image}" alt="${p.name}"><div><div class="eyebrow">${p.category.toUpperCase()}</div><h2>${p.name}</h2><div class="detail-price">$${p.price.toFixed(2)} <span>• In Stock</span></div><p>${p.desc} Designed with premium materials and made for everyday use.</p><ul class="features"><li>Premium quality materials</li><li>Modern timeless design</li><li>2 year warranty</li><li>Easy enquiry support</li></ul><button class="btn primary" onclick="addToCart(${p.id}); closeAll()">Enquire Now →</button></div></div>`;
  $("#overlay").classList.add("show"); $("#productModal").classList.add("open");
}
function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2200)}

renderCategories();renderProducts();renderCart();

$$(".filter-cat").forEach(b=>b.onclick=()=>{state.category=b.dataset.category;updateFilters();renderProducts()});
$("#sortSelect").onchange=e=>{state.sort=e.target.value;renderProducts()};
$("#maxPrice").oninput=e=>{$("#maxValue").textContent=e.target.value};
$("#applyFilter").onclick=()=>{state.maxPrice=+$("#maxPrice").value;renderProducts()};
$("#searchToggle").onclick=()=>{$("#searchBar").style.display="flex";$("#searchInput").focus();document.querySelector("#products").scrollIntoView({behavior:"smooth"})};
$("#searchInput").oninput=e=>{state.query=e.target.value.toLowerCase().trim();renderProducts()};
$("#clearSearch").onclick=()=>{$("#searchInput").value="";state.query="";renderProducts()};
$$(".view-toggle").forEach(b=>b.onclick=()=>{state.view=b.dataset.view;$$(".view-toggle").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts()});
$("#cartBtn").onclick=openCart;$("#overlay").onclick=closeAll;$$("[data-close]").forEach(b=>b.onclick=closeAll);
$("#mobileMenu").onclick=()=>$("#mobileNav").classList.toggle("open");
$$(".mobile-nav a").forEach(a=>a.onclick=()=>$("#mobileNav").classList.remove("open"));
$("#accountBtn").onclick=()=>toast("Account area — connect your authentication here");
$("#contactBtn").onclick=()=>toast("Thanks! Our team will contact you shortly.");
$("#detailEnquire").onclick=()=>{addToCart(1)};
$("#plus").onclick=()=>$("#quantity").textContent=+$("#quantity").textContent+1;
$("#minus").onclick=()=>$("#quantity").textContent=Math.max(1,+$("#quantity").textContent-1);
$("#sendEnquiry").onclick=()=>{if(!state.cart.length)return toast("Add a product first");toast("Enquiry sent — thank you!");state.cart=[];renderCart();closeAll()};
$("#subscribe").onclick=()=>toast("You're subscribed to the newsletter.");
$$(".thumb").forEach((b,i)=>b.onclick=()=>{$$(".thumb").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#detailImage").src=b.querySelector("img").src.replace("w=300","w=1200")});

let slide=0;const slides=[
 "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85",
 "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85",
 "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=85"
];
function changeSlide(dir){slide=(slide+dir+slides.length)%slides.length;$(".hero-image img").src=slides[slide];$$(".hero-dots i").forEach((d,i)=>d.classList.toggle("active",i===slide))}
$(".hero-arrow.prev").onclick=()=>changeSlide(-1);$(".hero-arrow.next").onclick=()=>changeSlide(1);
