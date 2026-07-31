
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
if(menuBtn){menuBtn.addEventListener('click',()=>navLinks.classList.toggle('open'));}

const products = [
 {name:'Classic Sourdough',cat:'breads',price:7.50,img:'sourdough.png',desc:'Slow-fermented artisan loaf with a crisp crust.'},
 {name:'Rye & Caraway Loaf',cat:'breads',price:8.00,img:'bread-display.png',desc:'Earthy rye loaf finished with aromatic caraway.'},
 {name:'Rosemary Focaccia',cat:'breads',price:6.25,img:'focaccia.png',desc:'Olive-oil focaccia with rosemary and sea salt.'},
 {name:'Celebration Cake',cat:'cakes',price:45.00,img:'celebration-cake.png',desc:'Custom decorated cake for birthdays and milestones.'},
 {name:'Chocolate Layer Cake',cat:'cakes',price:38.00,img:'chocolate-cake.png',desc:'Rich cocoa sponge with silky chocolate frosting.'},
 {name:'Vanilla Cupcake Box',cat:'cakes',price:18.00,img:'cupcakes.png',desc:'Six soft vanilla cupcakes with seasonal decoration.'},
 {name:'Butter Croissant',cat:'pastries',price:3.25,img:'croissants.png',desc:'Flaky, buttery layers baked fresh each morning.'},
 {name:'Berry Danish',cat:'pastries',price:4.25,img:'berry-danish.png',desc:'Laminated pastry filled with berries and cream.'},
 {name:'Fruit Tart',cat:'pastries',price:5.75,img:'fruit-tart.png',desc:'Vanilla custard tart topped with fresh fruit.'},
 {name:'Summer Peach Galette',cat:'seasonal',price:16.00,img:'peach-galette.png',desc:'Rustic seasonal tart with local peaches.'},
 {name:'Holiday Spice Loaf',cat:'seasonal',price:9.50,img:'spice-loaf.png',desc:'Warm spices, citrus peel and toasted nuts.'},
 {name:'Autumn Apple Tart',cat:'seasonal',price:20.00,img:'apple-tart.png',desc:'Buttery pastry layered with cinnamon apples.'}
];

let cart = JSON.parse(localStorage.getItem('freshbite-cart') || '[]');
function money(v){return '$'+v.toFixed(2);}
function productCard(p){
 return `<article class="card product-card" data-cat="${p.cat}">
   <img src="${p.img}" alt="${p.name}" loading="lazy">
   <div class="card-body"><h3>${p.name}</h3><p>${p.desc}</p>
   <div class="card-actions"><span class="price">${money(p.price)}</span>
   <button class="btn btn-primary add-cart" data-name="${p.name}">Add to order</button></div></div>
 </article>`;
}
function renderProducts(filter='all',term=''){
 const grid=document.querySelector('#product-grid'); if(!grid) return;
 const list=products.filter(p=>(filter==='all'||p.cat===filter)&&p.name.toLowerCase().includes(term.toLowerCase()));
 grid.innerHTML=list.map(productCard).join('') || '<p>No matching products found.</p>';
 bindAddButtons();
}
function bindAddButtons(){
 document.querySelectorAll('.add-cart').forEach(btn=>btn.addEventListener('click',()=>{
   const p=products.find(x=>x.name===btn.dataset.name); cart.push(p);
   localStorage.setItem('freshbite-cart',JSON.stringify(cart)); updateCart(); toast(`${p.name} added to your order`);
 }));
}
function updateCart(){
 const count=document.querySelector('#cart-count'); if(count) count.textContent=cart.length;
 const items=document.querySelector('#cart-items');
 if(items){
   items.innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-item"><div><strong>${p.name}</strong><br><span>${money(p.price)}</span></div><button class="icon-btn remove-item" data-i="${i}" aria-label="Remove ${p.name}">×</button></div>`).join(''):'<p>Your order is empty.</p>';
   document.querySelector('#cart-total').textContent=money(cart.reduce((s,p)=>s+p.price,0));
   document.querySelectorAll('.remove-item').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.i,1);localStorage.setItem('freshbite-cart',JSON.stringify(cart));updateCart();});
 }
}
function toast(msg){
 const el=document.querySelector('#toast'); if(!el)return; el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200);
}
document.addEventListener('DOMContentLoaded',()=>{
 renderProducts();updateCart();bindAddButtons();
 document.querySelectorAll('.filter-btn').forEach(btn=>btn.onclick=()=>{
   document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
   renderProducts(btn.dataset.filter,document.querySelector('#search')?.value||'');
 });
 document.querySelector('#search')?.addEventListener('input',e=>{
   const f=document.querySelector('.filter-btn.active')?.dataset.filter||'all';renderProducts(f,e.target.value);
 });
 const panel=document.querySelector('#cart-panel'),overlay=document.querySelector('#overlay');
 function openCart(){panel?.classList.add('open');overlay?.classList.add('show');}
 function closeCart(){panel?.classList.remove('open');overlay?.classList.remove('show');}
 document.querySelectorAll('.open-cart').forEach(b=>b.onclick=openCart);
 document.querySelector('#close-cart')?.addEventListener('click',closeCart);overlay?.addEventListener('click',closeCart);
 document.querySelector('#checkout')?.addEventListener('click',()=>{if(!cart.length)return toast('Add an item before checking out.');toast('Demo checkout complete — thank you!');cart=[];localStorage.setItem('freshbite-cart','[]');updateCart();closeCart();});
 document.querySelectorAll('form[data-demo]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();toast('Thank you! Your message has been received.');form.reset();}));
});
