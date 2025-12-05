const products = [
  // Product 1: Dark blue/black oversized hoodie
  { 
    id: 1, 
    name: {en:'Classic Oversized Hoodie', kh:'អាវរងារខែត្រជាក់'}, 
    price: 49.99, 
    img: 'photo/blazer.jpg',  // CHANGED from images/ to photo/
    sizes: ['M','L','XL','XXL'], 
    colors: ['Black','Navy','Grey'] 
  },
  
  // Product 2: Graphic oversized T-shirts
  { 
    id: 2, 
    name: {en:'Street Oversized Tee Collection', kh:'អាវយឺត​ ស្វេក'}, 
    price: 24.5, 
    img: 'photo/Over size shirts.jpg', // CHANGED from images/ to photo/
    sizes: ['Free size'], 
    colors: ['Black','White','Yellow','Maroon'] 
  },
  
  // Product 3: Casual Sweat Shorts
  { 
    id: 3, 
    name: {en:'Casual Sweatshorts', kh:'ខោខ្លីត្រជាក់'}, 
    price: 29.0, 
    img: 'photo/Short North.jpg', // CHANGED from images/ to photo/
    sizes: ['S','M','L','XL'], 
    colors: ['Light Gray','Charcoal Gray','Black'] 
  },
  
  // Product 4: Mock-neck long-sleeve shirt (Green)
  { 
    id: 4, 
    name: {en:'Mock Neck Longsleeve Shirt', kh:'អាវដៃវែងបុរស់'}, 
    price: 35.0, 
    img: "photo/Men's long-sleeved long-sleeved shirt green.jpg", // CHANGED from images/ to photo/
    sizes: ['M','L','XL'], 
    colors: ['Green','Gray','Brown'] 
  },
  
  // Product 5: Sun-graphic hoodie
  // Note: Ensure the filename matches exactly what is in your folder. I am using the name from your upload.
  { 
    id: 5, 
    name: {en:'Sunrise Graphic Hoodie', kh:'អាវរងាសាច់ក្រាស់'}, 
    price: 47.0, 
    img: "photo/Factory direct sales of men's hoodies and top while.jpg", // CHANGED from images/ to photo/
    sizes: ['M','L','XL'], 
    colors: ['Cream','Khaki','Brown'] 
  },
  
  // Product 6: Black graphic crewneck/oversized tee
  { 
    id: 6, 
    name: {en:'Bold Graphic Oversized Tee', kh:'អាវយឺតទំហំធំមានអក្សរធំ'}, 
    price: 26.5, 
    img: 'photo/over.jpg', // CHANGED from images/ to photo/
    sizes: ['S','M','L','XL'], 
    colors: ['Black','Grey','Red','Pink'] 
  }
];

const telegramLink = 'https://t.me/dafahasa';
const facebookLink = 'https://www.facebook.com/profile.php?id=61584769916638';
const whatsappLink = 'https://wa.me/0974369160';

const productList = document.getElementById('productList');
const modal = document.getElementById('modal');
const selectedList = document.getElementById('selectedList');
const closeModal = document.querySelector('.close');
const modalHeader = document.getElementById('modalHeader');
const langSelect = document.getElementById('languageSelect');

let selectedProducts = [];
let currentLang = 'en';

function renderProducts(){
  productList.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name[currentLang]}" onerror="this.src='https://via.placeholder.com/200?text=Image+Not+Found'">
      <h3>${p.name[currentLang]}</h3>
      <p>${currentLang==='en'?'Price':'តម្លៃ'}: $${p.price.toFixed(2)}</p>
      <button onclick="selectProduct(${p.id})">${currentLang==='en'?'Select':'ជ្រើសរើស'}</button>
    `;
    productList.appendChild(div);
  });
}

langSelect.addEventListener('change', ()=>{
  currentLang = langSelect.value;
  renderProducts();
  updateModal();
});

function selectProduct(id){
  const item = products.find(p => p.id === id);
  if(!selectedProducts.some(p => p.id === id)){
    selectedProducts.push({ ...item, qty:1, size:item.sizes[0], color:item.colors[0] });
  }
  updateModal();
  modal.style.display = 'flex';
}

function updateModal(){
  selectedList.innerHTML = '';
  modalHeader.textContent = currentLang==='en'?'Selected Products':'ផលិតផលដែលបានជ្រើសរើស';
  selectedProducts.forEach((p,index)=>{
    const colorSelect = `<select class="color-select" onchange="updateColor(${index},this.value)">${p.colors.map(c => `<option value="${c}" ${c===p.color?'selected':''}>${c}</option>`).join('')}</select>`;
    const li = document.createElement('li');
    li.innerHTML = `<span>${p.name[currentLang]} - $${p.price.toFixed(2)}</span>
      ${currentLang==='en'?'Size':'ទំហំ'}: <select onchange="updateSize(${index},this.value)">${p.sizes.map(s=>`<option value="${s}" ${s===p.size?'selected':''}>${s}</option>`).join('')}</select>
      ${currentLang==='en'?'Color':'ពណ៌'}: ${colorSelect}
      Qty: <input type="number" min="1" value="${p.qty}" onchange="updateQty(${index},this.value)">
      <button onclick="removeProduct(${index})">${currentLang==='en'?'Remove':'ដកចេញ'}</button>`;
    selectedList.appendChild(li);
  });
  const total = selectedProducts.reduce((sum,p)=>sum+p.price*p.qty,0);
  const totalLi = document.createElement('li');
  totalLi.style.fontWeight='bold';
  totalLi.style.marginTop='10px';
  totalLi.textContent = currentLang==='en'?`Total: $${total.toFixed(2)}`:`សរុប: $${total.toFixed(2)}`;
  selectedList.appendChild(totalLi);
}

function updateSize(index,value){ selectedProducts[index].size = value; }
function updateColor(index,value){ selectedProducts[index].color = value; }
function updateQty(index,value){ selectedProducts[index].qty = parseInt(value)||1; updateModal(); }
function removeProduct(index){ selectedProducts.splice(index,1); updateModal(); }

function sendMessage(platform){
  if(selectedProducts.length===0) return;
  let message = currentLang==='en'?'Hello! I want to buy:\n':'សួស្តី! ខ្ញុំចង់ទិញ៖\n';
  selectedProducts.forEach(p=>{ message += `- ${p.name[currentLang]} (Size:${p.size}, Color:${p.color}, Qty:${p.qty})\nImage: ${p.img}\n`; });
  const total = selectedProducts.reduce((sum,p)=>sum+p.price*p.qty,0);
  message += currentLang==='en'?`Total: $${total.toFixed(2)}`:`សរុប: $${total.toFixed(2)}`;
  if(platform==='telegram') window.open(`${telegramLink}?text=${encodeURIComponent(message)}`, '_blank');
  else if(platform==='facebook') window.open(facebookLink, '_blank');
  else if(platform==='whatsapp') window.open(`${whatsappLink}?text=${encodeURIComponent(message)}`, '_blank');
}

document.getElementById('buyTelegram').addEventListener('click',()=>sendMessage('telegram'));
document.getElementById('buyFacebook').addEventListener('click',()=>sendMessage('facebook'));
document.getElementById('buyWhatsApp').addEventListener('click',()=>sendMessage('whatsapp'));

closeModal.addEventListener('click',()=>{ modal.style.display='none'; });
window.addEventListener('click',e=>{ if(e.target===modal) modal.style.display='none'; });

// Dark mode toggle
const toggleDarkMode = () => document.body.classList.toggle('dark-mode');
const darkBtn = document.createElement('button');
darkBtn.textContent = 'Toggle Dark Mode';
darkBtn.style.position = 'fixed';
darkBtn.style.bottom = '20px';
darkBtn.style.right = '20px';
darkBtn.style.padding = '10px 15px';
darkBtn.style.background = '#0088cc';
darkBtn.style.color = '#fff';
darkBtn.style.border = 'none';
darkBtn.style.borderRadius = '5px';
darkBtn.style.cursor = 'pointer';
darkBtn.style.zIndex = 1000;
darkBtn.addEventListener('click', toggleDarkMode);
document.body.appendChild(darkBtn);

renderProducts();